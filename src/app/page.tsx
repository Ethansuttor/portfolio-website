import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TechnicalMatrix } from "@/components/TechnicalMatrix";
import { EngineeringExperience } from "@/components/EngineeringExperience";
import { SystemLog } from "@/components/SystemLog";
import { CaseStudies } from "@/components/CaseStudies";
import { AboutMe } from "@/components/AboutMe";
import { Contact } from "@/components/Contact";

const footerLinks = [
  { label: "GitHub", href: "https://github.com/Ethansuttor" },
  { label: "LinkedIn", href: "https://linkedin.com/in/ethan-suttor" },
];

export default function Home() {
  return (
    <main id="top" className="min-h-screen bg-background text-on-background selection:bg-primary-container selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Ethan Suttor",
            url: "https://ethansuttor.com",
            email: "ethan.suttor@louisville.edu",
            jobTitle: "Electrical Engineering Student",
            affiliation: {
              "@type": "EducationalOrganization",
              name: "University of Louisville",
            },
            sameAs: [
              "https://linkedin.com/in/ethan-suttor",
              "https://github.com/Ethansuttor",
            ],
            description: "Electrical Engineering student specializing in FPGA architecture, embedded systems, and hardware/software co-design.",
          }),
        }}
      />
      <div className="flex flex-col">
        <Header />
        
        <div className="w-full">
          <Hero />
          <CaseStudies />
          <TechnicalMatrix />
          <div id="experience">
            <EngineeringExperience />
            <SystemLog />
          </div>
          <AboutMe />
          <Contact />
        </div>
        
        {/* Footer */}
        <footer className="bg-[#131313] w-full border-t border-outline-variant/15 flex flex-col md:flex-row justify-between items-center px-8 lg:px-24 py-12 md:py-16 gap-6 md:gap-8">
          <div className="font-sans text-[0.6875rem] font-black uppercase tracking-[0.2em] text-[#e2e2e2] opacity-50 flex items-center gap-2">
            <span className="h-2 w-2 bg-primary-container animate-pulse rounded-full"></span>
            © {new Date().getFullYear()} Ethan Suttor
          </div>
          
          <div className="flex gap-8 md:gap-10">
            {footerLinks.map((link) => (
              <a 
                key={link.label}
                className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#e2e2e2] opacity-50 hover:text-primary hover:opacity-100 transition-all duration-300" 
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            ))}
            <a 
              className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#e2e2e2] opacity-50 hover:text-primary hover:opacity-100 transition-all duration-300" 
              href="#top"
            >
              ↑ Top
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
