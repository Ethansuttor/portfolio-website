import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_INBOX } from "@/lib/site";
import { CONTACT_LIMITS, EMAIL_PATTERN, HONEYPOT_FIELD } from "@/lib/contact";
import { clientKey, rateLimit } from "@/lib/rateLimit";

/** 5 submissions per 10 minutes per IP — far above human use, far below abuse. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

/**
 * Reject oversized bodies before parsing. Every field is capped well under this,
 * so anything larger is malicious or broken, and parsing it first would mean
 * doing the work anyway.
 */
const MAX_BODY_BYTES = 16 * 1024;

/**
 * Resend only accepts a `from` address on a domain you've verified. Their shared
 * onboarding sender works out of the box for mail to your own inbox; once
 * ethansuttor.com is verified, set CONTACT_FROM_EMAIL to something on it.
 */
const FROM_ADDRESS = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

/**
 * While using the onboarding sender, Resend only delivers to the address that
 * owns the API key — anything else comes back 403. Overridable by env so the
 * inbox can change without a code edit and redeploy.
 */
const TO_ADDRESS = process.env.CONTACT_TO_EMAIL || CONTACT_INBOX;

const escapeHTML = (str: string) =>
  str.replace(/[&<>'"]/g, (tag) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  }[tag] || tag));

/** Trimmed and length-capped, or null when the field wasn't a string at all. */
function readString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  return value.trim().slice(0, max);
}

export async function POST(request: NextRequest) {
  const { allowed, retryAfter } = rateLimit(
    clientKey(request.headers),
    RATE_LIMIT,
    RATE_WINDOW_MS,
  );

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many messages sent. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Message is too long." }, { status: 413 });
  }

  let body: Record<string, unknown>;

  try {
    const raw = await request.text();
    // content-length is client-supplied, so re-check the bytes we actually got.
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Message is too long." }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // JSON.parse happily returns strings, numbers and null; only an object has
  // the fields below, and indexing a non-object would throw.
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot. Report success rather than an error so a bot logs a win and moves
  // on instead of retrying with a different payload shape.
  const honeypot = body[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim()) {
    return NextResponse.json({ success: true });
  }

  const name = readString(body.name, CONTACT_LIMITS.name);
  const email = readString(body.email, CONTACT_LIMITS.email);
  const subject = readString(body.subject, CONTACT_LIMITS.subject) ?? "";
  const message = readString(body.message, CONTACT_LIMITS.message);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are all required." },
      { status: 400 },
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 },
    );
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("Contact form: RESEND_API_KEY is not set.");
    return NextResponse.json({ error: "Email service not configured." }, { status: 500 });
  }

  // Newlines can't smuggle extra headers through Resend's JSON API the way they
  // can over raw SMTP, but a subject spanning several rows still renders badly.
  const cleanSubject = subject.replace(/[\r\n]+/g, " ").trim();
  const safeName = escapeHTML(name);
  const safeEmail = escapeHTML(email);
  const safeSubject = escapeHTML(cleanSubject || "—");
  const safeMessage = escapeHTML(message).replace(/\n/g, "<br/>");

  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      // The whole point of collecting an address: hitting reply reaches them.
      replyTo: email,
      subject: cleanSubject ? `[Portfolio] ${cleanSubject}` : `[Portfolio] Message from ${name}`,
      text: `From: ${name} <${email}>\nSubject: ${cleanSubject || "—"}\n\n${message}`,
      html:
        `<p><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p>` +
        `<p><strong>Subject:</strong> ${safeSubject}</p><hr/><p>${safeMessage}</p>`,
    });

    if (error) {
      // Log server-side, but don't leak provider details to the browser.
      console.error("Contact form send failed:", error);
      return NextResponse.json(
        { error: "Could not send your message right now. Please email me directly." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("Contact form send threw:", err);
    return NextResponse.json(
      { error: "Could not send your message right now. Please email me directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
