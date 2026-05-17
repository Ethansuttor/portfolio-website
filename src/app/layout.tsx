import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ethansuttor.com"),
  title: "Ethan Suttor | Electrical Engineering Portfolio",
  description: "Ethan Suttor — Electrical Engineering student at the University of Louisville specializing in FPGA architecture, embedded systems, and hardware/software co-design.",
  alternates: { canonical: "/" },
  keywords: ["Ethan Suttor", "Electrical Engineering", "FPGA", "Embedded Systems", "University of Louisville", "Hardware Software Co-Design"],
  authors: [{ name: "Ethan Suttor", url: "https://ethansuttor.com" }],
  creator: "Ethan Suttor",
  openGraph: {
    type: "website",
    url: "https://ethansuttor.com",
    title: "Ethan Suttor | Electrical Engineering Portfolio",
    description: "Electrical Engineering student at U of L. FPGA, embedded systems, hardware/software co-design.",
    siteName: "Ethan Suttor",
    images: [{ url: "/assets/hero-photo.jpg", width: 1200, height: 630, alt: "Ethan Suttor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ethan Suttor | Electrical Engineering Portfolio",
    description: "Electrical Engineering student at U of L. FPGA, embedded systems, hardware/software co-design.",
    images: ["/assets/hero-photo.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
