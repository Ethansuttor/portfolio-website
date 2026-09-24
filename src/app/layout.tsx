import type { Metadata } from "next";
import { Archivo, Hanken_Grotesk, Martian_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["wdth"],
  display: "swap",
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Ethan Suttor | Electrical Engineering Portfolio",
  description: "Ethan Suttor is an electrical engineering student at the University of Louisville. He designs PCBs, writes embedded firmware and works in VHDL.",
  alternates: { canonical: "/" },
  keywords: ["Ethan Suttor", "Electrical Engineering", "FPGA", "Embedded Systems", "University of Louisville", "Hardware Software Co-Design"],
  authors: [{ name: "Ethan Suttor", url: "https://ethansuttor.com" }],
  creator: "Ethan Suttor",
  // og:image / twitter:image come from the opengraph-image.tsx file convention,
  // per route — setting `images` here would override the per-project cards.
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Ethan Suttor | Electrical Engineering Portfolio",
    description: "Electrical Engineering student at U of L. FPGA, embedded systems, hardware/software co-design.",
    siteName: "Ethan Suttor",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ethan Suttor | Electrical Engineering Portfolio",
    description: "Electrical Engineering student at U of L. FPGA, embedded systems, hardware/software co-design.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} data-scroll-behavior="smooth">
      <body className="antialiased font-sans">
        {children}
        {/* Both no-op in development and on non-Vercel hosts, so they don't
            need to be conditionally rendered. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
