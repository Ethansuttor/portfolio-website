'use client';

import { useEffect, useState } from "react";
import { EMAIL, LINKEDIN_LABEL, LINKEDIN_URL } from "@/lib/site";
import { CONTACT_LIMITS, EMAIL_PATTERN, HONEYPOT_FIELD } from "@/lib/contact";

type Status = "idle" | "loading" | "success" | "error";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

const labelClass = "block text-sm font-medium text-on-surface mb-2";

const controlClass =
  "w-full rounded-md bg-background/70 border border-outline-variant px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-[border-color,box-shadow] duration-200 text-on-surface placeholder:text-on-surface-variant/40 disabled:opacity-40";

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {hint && (
          <span className="ml-2 text-on-surface-variant/50 normal-case tracking-normal">{hint}</span>
        )}
      </label>
      {children}
    </div>
  );
}

/** Email and LinkedIn cards — the paths that work even if the form doesn't. */
function DirectLinks() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      // Clipboard access needs a secure context and can be denied outright.
      // The mailto link beside this button still works, so stay quiet.
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-outline-variant bg-surface-container-low p-7">
        <p className="text-sm text-on-surface-variant mb-2">Email</p>
        <a
          href={`mailto:${EMAIL}`}
          className="block text-xl sm:text-2xl font-semibold text-on-surface hover:text-primary transition-colors duration-300 break-all"
        >
          {EMAIL}
        </a>
        <button
          type="button"
          onClick={copyEmail}
          className="mt-5 btn-ghost px-4 py-2 text-sm cursor-pointer"
        >
          {copied ? (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2v-2M8 5a2 2 0 002 2h4a2 2 0 002-2M8 5a2 2 0 012-2h4a2 2 0 012 2m2 5h4m0 0l-2-2m2 2l-2 2" />
            </svg>
          )}
          {copied ? "Copied" : "Copy address"}
        </button>
      </div>

      <a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noreferrer"
        className="group block rounded-md border border-outline-variant bg-surface-container-low p-7 hover:border-primary/60 transition-colors duration-300"
      >
        <p className="text-sm text-on-surface-variant mb-2">LinkedIn</p>
        <span className="text-xl sm:text-2xl font-semibold text-on-surface group-hover:text-primary transition-colors duration-300 break-all">
          {LINKEDIN_LABEL}
        </span>
      </a>
    </div>
  );
}

export function Contact() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Clear the result banner on a timer. Doing this in an effect rather than a
  // bare setTimeout in the handler means unmounting mid-countdown can't fire a
  // setState on a dead component.
  useEffect(() => {
    if (status !== "success" && status !== "error") return;
    const timer = setTimeout(() => setStatus("idle"), 6000);
    return () => clearTimeout(timer);
  }, [status]);

  const setField = (field: keyof typeof EMPTY_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Catch the obvious problems before a round trip.
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg("Name, email, and message are all required.");
      setStatus("error");
      return;
    }
    if (!EMAIL_PATTERN.test(formData.email.trim())) {
      setErrorMsg("That email address doesn't look right.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, [HONEYPOT_FIELD]: honeypot }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setFormData(EMPTY_FORM);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to send. Please try again.");
      setStatus("error");
    }
  };

  const buttonLabel = {
    idle: "Send message",
    loading: "Sending...",
    success: "Message sent",
    error: "Try again",
  }[status];

  const buttonClass = {
    idle: "bg-primary text-on-primary-container hover:bg-[#f3cf7a]",
    loading: "bg-primary/50 text-on-primary-container cursor-not-allowed",
    success: "bg-led text-on-primary-container",
    error: "bg-tertiary text-on-primary-container",
  }[status];

  const isBusy = status === "loading";
  const remaining = CONTACT_LIMITS.message - formData.message.length;

  return (
    <section id="contact" className="relative py-24 md:py-32 px-5 sm:px-8 lg:px-16 border-t border-outline-variant">
      <div className="mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      <div className="lg:col-span-5">
        <h2 className="display text-on-surface text-[clamp(2.2rem,5vw,4rem)] mb-6">Get in touch</h2>
        <p className="text-on-surface-variant mb-10 max-w-md text-base md:text-lg leading-relaxed">
          If you&apos;re hiring for hardware or embedded work, or you just want to talk about a board, email me.
          The form goes to the same inbox.
        </p>

        <DirectLinks />
      </div>

      <div className="lg:col-span-7">
        <div className="rounded-md border border-outline-variant bg-surface-container-low p-6 sm:p-10 md:p-12 h-full">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field id="contact-name" label="Name">
              <input
                id="contact-name"
                className={controlClass}
                placeholder="Your name"
                type="text"
                autoComplete="name"
                maxLength={CONTACT_LIMITS.name}
                value={formData.name}
                onChange={setField("name")}
                required
                disabled={isBusy}
              />
            </Field>

            <Field id="contact-email" label="Email">
              <input
                id="contact-email"
                className={controlClass}
                placeholder="you@example.com"
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={CONTACT_LIMITS.email}
                value={formData.email}
                onChange={setField("email")}
                required
                disabled={isBusy}
              />
            </Field>

            </div>

            <Field id="contact-subject" label="Subject" hint="(optional)">
              <input
                id="contact-subject"
                className={controlClass}
                placeholder="What it's about"
                type="text"
                maxLength={CONTACT_LIMITS.subject}
                value={formData.subject}
                onChange={setField("subject")}
                disabled={isBusy}
              />
            </Field>

            <Field id="contact-message" label="Message">
              <textarea
                id="contact-message"
                className={`${controlClass} resize-none`}
                placeholder="What are you working on?"
                rows={6}
                maxLength={CONTACT_LIMITS.message}
                value={formData.message}
                onChange={setField("message")}
                required
                disabled={isBusy}
              />
              {remaining < 300 && (
                <p className="mt-2 text-right text-sm text-on-surface-variant">
                  {remaining} characters left
                </p>
              )}
            </Field>

            {/* Honeypot. Hidden from sight, from assistive tech, and from the tab
                order, so only a bot filling every field should touch it.
                No <label> and a non-semantic name, because browser autofill and
                password managers key off both — an earlier "Company" version got
                filled by Chrome and silently ate real submissions. The
                data-*-ignore hints opt out of 1Password and LastPass too. */}
            <div aria-hidden="true" className="absolute w-px h-px -m-px overflow-hidden opacity-0">
              <input
                id="contact-ref"
                name={HONEYPOT_FIELD}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                data-1p-ignore="true"
                data-lpignore="true"
                aria-hidden="true"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div aria-live="polite" className="empty:hidden">
              {status === "error" && (
                <p className="text-sm text-tertiary">
                  {errorMsg}
                </p>
              )}
              {status === "success" && (
                <p className="text-sm text-led">
                  Sent. I&apos;ll reply from my email.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isBusy || status === "success"}
              className={`w-full rounded-[6px] font-bold text-base py-4 transition-all duration-300 ${buttonClass}`}
            >
              {buttonLabel}
            </button>
          </form>
        </div>
      </div>
      </div>
    </section>
  );
}
