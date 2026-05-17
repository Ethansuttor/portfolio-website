'use client';

import { useState } from "react";
import { ScrollReveal } from "./ScrollReveal";

type Status = "idle" | "loading" | "success" | "error";

export function Contact() {
  const [formData, setFormData] = useState({ name: '', subject: '', message: '' });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("https://formspree.io/f/xjgplybl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setFormData({ name: '', subject: '', message: '' });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to send. Please try again.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
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

  return (
    <section className="section-divider py-24 px-8 md:px-24 bg-surface flex flex-col md:flex-row gap-12 md:gap-20 border-t border-outline-variant/10" id="contact">
      <ScrollReveal direction="left" className="w-full md:w-1/2">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-8 leading-[0.85] text-on-surface">
          Get in<br/>
          <span className="text-primary">Touch</span>
        </h2>
        <p className="text-on-surface-variant mb-12 max-w-md text-base md:text-lg leading-relaxed">
          Currently working as an Electrical Engineering Co-op at Gaylor Electric.
        </p>

        <div className="space-y-6">
          <a
            href="mailto:ethan.suttor@louisville.edu"
            className="block bg-surface-container-high p-8 border-l-4 border-primary-container group hover:bg-surface-container-highest transition-all duration-300 card-lift"
          >
            <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary mb-3">Email</p>
            <span className="text-lg sm:text-xl md:text-2xl font-bold select-all text-on-surface group-hover:text-primary transition-colors duration-300">
              ethan.suttor@louisville.edu
            </span>
          </a>

          <a
            href="https://linkedin.com/in/ethan-suttor"
            target="_blank"
            rel="noreferrer"
            className="block bg-surface-container-high p-8 border-l-4 border-primary-container group hover:bg-surface-container-highest transition-all duration-300 card-lift"
          >
            <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary mb-3">LinkedIn</p>
            <span className="text-lg sm:text-xl md:text-2xl font-bold select-all text-on-surface group-hover:text-primary transition-colors duration-300">
              linkedin.com/in/ethan-suttor
            </span>
          </a>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="right" className="w-full md:w-1/2">
        <div className="bg-surface-container-low p-6 sm:p-8 md:p-12 border border-outline-variant/10 h-full">
          <form className="space-y-8" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="contact-name" className="block font-sans text-[0.6875rem] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-3">Name</label>
              <input
                id="contact-name"
                className="w-full bg-transparent border-b border-outline-variant py-4 focus:outline-none focus:border-primary focus:ring-0 transition-colors duration-300 text-on-surface placeholder:text-on-surface/20"
                placeholder="Your name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                disabled={status === "loading"}
              />
            </div>
            <div>
              <label htmlFor="contact-subject" className="block font-sans text-[0.6875rem] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-3">Subject</label>
              <input
                id="contact-subject"
                className="w-full bg-transparent border-b border-outline-variant py-4 focus:outline-none focus:border-primary transition-colors duration-300 text-on-surface placeholder:text-on-surface/20"
                placeholder="Project or general inquiry"
                type="text"
                value={formData.subject}
                onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                disabled={status === "loading"}
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block font-sans text-[0.6875rem] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-3">Message</label>
              <textarea
                id="contact-message"
                className="w-full bg-transparent border-b border-outline-variant py-4 focus:outline-none focus:border-primary transition-colors duration-300 text-on-surface resize-none placeholder:text-on-surface/20"
                placeholder="What are you working on?"
                rows={4}
                value={formData.message}
                onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                required
                disabled={status === "loading"}
              />
            </div>

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

            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className={`cta-primary w-full font-black uppercase tracking-[0.3em] py-5 transition-all duration-300 shadow-xl ${buttonClass}`}
            >
              {buttonLabel}
            </button>
          </form>
        </div>
      </ScrollReveal>
    </section>
  );
}
