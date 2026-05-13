'use client';

import { useState } from "react";
import { ScrollReveal } from "./ScrollReveal";

export function Contact() {
  const [formData, setFormData] = useState({ name: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const mailtoBody = `Name: ${formData.name}\nSubject: ${formData.subject}\n\n${formData.message}`;
    const mailtoLink = `mailto:ethan.suttor@louisville.edu?subject=${encodeURIComponent(formData.subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(mailtoBody)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

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
          <form className="space-y-8" onSubmit={handleSubmit}>
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
              ></textarea>
            </div>
            <p className="text-[0.65rem] text-on-surface-variant/50 uppercase tracking-widest -mt-4">
              Clicking send will open your email client with this message pre-filled.
            </p>
            <button
              type="submit"
              className={`cta-primary w-full font-black uppercase tracking-[0.3em] py-5 transition-all duration-300 shadow-xl ${
                submitted
                  ? 'bg-green-700 text-white'
                  : 'bg-primary text-background hover:bg-white hover:text-black'
              }`}
            >
              {submitted ? 'Opening Email Client...' : 'Send Message'}
            </button>
          </form>
        </div>
      </ScrollReveal>
    </section>
  );
}
