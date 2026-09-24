import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TechnicalMatrix } from "@/components/TechnicalMatrix";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { CaseStudies } from "@/components/CaseStudies";
import { BuildLogPreview } from "@/components/BuildLogPreview";
import { AboutMe } from "@/components/AboutMe";
import { Contact } from "@/components/Contact";
import Link from "next/link";
import { BUILD_LOG_HREF, EMAIL, GITHUB_URL, LINKEDIN_URL, SITE_URL } from "@/lib/site";

const footerLinks = [
  { label: "GitHub", href: GITHUB_URL },
  { label: "LinkedIn", href: LINKEDIN_URL },
];

const footerLinkClass = "text-sm text-on-surface-variant hover:text-primary transition-colors";

export default function Home() {
  return (
    <main id="top" className="min-h-screen bg-background text-on-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Ethan Suttor",
            url: SITE_URL,
            email: EMAIL,
            jobTitle: "Electrical Engineering Student",
            affiliation: {
              "@type": "EducationalOrganization",
              name: "University of Louisville",
            },
            sameAs: [LINKEDIN_URL, GITHUB_URL],
            description: "Electrical Engineering student specializing in FPGA architecture, embedded systems, and hardware/software co-design.",
          }),
        }}
      />
      <Header />

      <Hero />
      <CaseStudies />
      <BuildLogPreview />
      <AboutMe />
      <TechnicalMatrix />
      <ExperienceTimeline />
      <Contact />

      <footer className="border-t border-outline-variant px-5 sm:px-8 lg:px-16 py-10">
        <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-on-surface-variant">© {new Date().getFullYear()} Ethan Suttor</p>
          <nav aria-label="Elsewhere" className="flex items-center gap-8">
            {footerLinks.map((link) => (
              <a key={link.label} className={footerLinkClass} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
            <Link className={footerLinkClass} href={BUILD_LOG_HREF}>
              Build log
            </Link>
            <a className={footerLinkClass} href="#top">
              ↑ Top
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
