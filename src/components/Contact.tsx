'use client';

import { useEffect, useState } from "react";
import { EMAIL, LINKEDIN_LABEL, LINKEDIN_URL } from "@/lib/site";
import { CONTACT_LIMITS, EMAIL_PATTERN, HONEYPOT_FIELD } from "@/lib/contact";

type Status = "idle" | "loading" | "success" | "error";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

const labelClass =
  "block font-sans text-[0.6875rem] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-3";

const controlClass =
  "w-full bg-transparent border-b border-outline-variant py-4 focus:outline-none focus:border-primary transition-colors duration-300 text-on-surface placeholder:text-on-surface/20 disabled:opacity-40";

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
          <span className="ml-2 text-on-surface-variant/40 tracking-normal">{hint}</span>
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
    <div className="space-y-6">
      <div className="bg-surface-container-high p-8 border-l-4 border-primary-container group hover:bg-surface-container-highest transition-all duration-300">
        <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary mb-3">Email</p>
        <a
          href={`mailto:${EMAIL}`}
          className="block text-lg sm:text-xl md:text-2xl font-bold select-all text-on-surface group-hover:text-primary transition-colors duration-300 break-all"
        >
          {EMAIL}
        </a>
        <button
          type="button"
          onClick={copyEmail}
          className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 border border-outline-variant/50 hover:border-primary text-[0.65rem] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer"
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
        className="block bg-surface-container-high p-8 border-l-4 border-primary-container group hover:bg-surface-container-highest transition-all duration-300 card-lift"
      >
        <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary mb-3">LinkedIn</p>
        <span className="text-lg sm:text-xl md:text-2xl font-bold text-on-surface group-hover:text-primary transition-colors duration-300 break-all">
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
    idle: "Send Message",
    loading: "Sending...",
    success: "Message Sent!",
    error: "Try Again",
  }[status];

  const buttonClass = {
    idle: "bg-primary text-background hover:bg-white hover:text-black",
    loading: "bg-primary/50 text-background cursor-not-allowed",
    success: "bg-green-700 text-white",
    error: "bg-red-900 text-white",
  }[status];

  const isBusy = status === "loading";
  const remaining = CONTACT_LIMITS.message - formData.message.length;

  return (
    <section
      className="section-divider py-24 px-8 md:px-24 bg-surface flex flex-col md:flex-row gap-12 md:gap-20 border-t border-outline-variant/10"
      id="contact"
    >
      <div className="w-full md:w-1/2">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-8 leading-[0.85] text-on-surface">
          Get in<br />
          <span className="text-primary">Touch</span>
        </h2>
        <p className="text-on-surface-variant mb-12 max-w-md text-base md:text-lg leading-relaxed">
          Currently working as an Electrical Engineering Co-op at Gaylor Electric.
        </p>

        <DirectLinks />
      </div>

      <div className="w-full md:w-1/2">
        <div className="bg-surface-container-low p-6 sm:p-8 md:p-12 border border-outline-variant/10 h-full">
          <form className="space-y-8" onSubmit={handleSubmit} noValidate>
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

            <Field id="contact-subject" label="Subject" hint="(optional)">
              <input
                id="contact-subject"
                className={controlClass}
                placeholder="Project or general inquiry"
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
                rows={4}
                maxLength={CONTACT_LIMITS.message}
                value={formData.message}
                onChange={setField("message")}
                required
                disabled={isBusy}
              />
              {remaining < 300 && (
                <p className="mt-2 text-right text-[0.6rem] uppercase tracking-widest text-on-surface-variant/50">
                  {remaining} characters left
                </p>
              )}
            </Field>

            {/* Honeypot. Hidden from sight, from assistive tech, and from the tab
                order, so only a bot filling every field will ever touch it. */}
            <div aria-hidden="true" className="absolute w-px h-px -m-px overflow-hidden opacity-0">
              <label htmlFor="contact-company">Company</label>
              <input
                id="contact-company"
                name={HONEYPOT_FIELD}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div aria-live="polite" className="empty:hidden">
              {status === "error" && (
                <p className="text-[0.65rem] text-red-400 uppercase tracking-widest -mt-4">
                  {errorMsg}
                </p>
              )}
              {status === "success" && (
                <p className="text-[0.65rem] text-green-400 uppercase tracking-widest -mt-4">
                  Message sent — I&apos;ll get back to you soon.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isBusy || status === "success"}
              className={`cta-primary w-full font-black uppercase tracking-[0.3em] py-5 transition-all duration-300 shadow-xl ${buttonClass}`}
            >
              {buttonLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
