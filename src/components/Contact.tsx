'use client';

import { useEffect, useState } from "react";
import { EMAIL, LINKEDIN_LABEL, LINKEDIN_URL } from "@/lib/site";
import { CONTACT_LIMITS, HONEYPOT_FIELD, validateContactField, type ContactErrors, type RequiredContactField } from "@/lib/contact";

type Status = "idle" | "loading" | "success" | "error";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };
const REQUIRED_FIELDS = ["name", "email", "message"] as const;

const labelClass = "block text-sm font-medium text-on-surface mb-2";

const controlClass =
  "w-full rounded-md bg-background/70 border border-outline px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-[border-color,box-shadow] duration-200 text-on-surface placeholder:text-on-surface-variant/70 disabled:opacity-40";

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
          <span className="ml-2 text-on-surface-variant normal-case tracking-normal">{hint}</span>
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
  const [errors, setErrors] = useState<ContactErrors>({});

  const setField = (field: keyof typeof EMPTY_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field !== "subject") setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (status === "error" || status === "success") setStatus("idle");
  };

  const validateField = (field: RequiredContactField) => {
    setErrors((prev) => ({ ...prev, [field]: validateContactField(field, formData[field]) }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Catch the obvious problems before a round trip.
    const nextErrors: ContactErrors = {
      name: validateContactField("name", formData.name),
      email: validateContactField("email", formData.email),
      message: validateContactField("message", formData.message),
    };
    setErrors(nextErrors);
    const invalidField = REQUIRED_FIELDS.find((field) => nextErrors[field]);
    if (invalidField) {
      setStatus("idle");
      e.currentTarget.querySelector<HTMLElement>(`#contact-${invalidField}`)?.focus();
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
        setErrorMsg(res.status < 500 && typeof data.error === "string" ? data.error : "");
        setStatus("error");
        return;
      }

      setStatus("success");
      setFormData(EMPTY_FORM);
    } catch {
      setErrorMsg("");
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
                onBlur={() => validateField("name")}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                required
                disabled={isBusy}
              />
              {errors.name && (
                <p id="contact-name-error" className="mt-2 text-sm text-tertiary">{errors.name}</p>
              )}
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
                onBlur={() => validateField("email")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
                required
                disabled={isBusy}
              />
              {errors.email && (
                <p id="contact-email-error" className="mt-2 text-sm text-tertiary">{errors.email}</p>
              )}
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
                onBlur={() => validateField("message")}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "contact-message-error" : undefined}
                required
                disabled={isBusy}
              />
              {errors.message && (
                <p id="contact-message-error" className="mt-2 text-sm text-tertiary">{errors.message}</p>
              )}
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
                  {errorMsg && <>{errorMsg} </>}
                  Couldn&apos;t send. Email me at{" "}
                  <a href={`mailto:${EMAIL}`} className="underline underline-offset-4 break-all">{EMAIL}</a>{" "}
                  instead.
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
