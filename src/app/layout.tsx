import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/site";

/* One-font system: Inter — a modern, clean, professional sans-serif (the
   industry-standard UI face for CS/AI products) used consistently for
   display headings, body copy, labels and numerals. Replaces the previous
   3-font mix (Playfair Display · Manrope · Geist Mono). The role classes
   (.font-display / .font-mono-num / .font-script) remain as hierarchy
   hooks in globals.css but all resolve to this single family. */

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Ahnab Rashid",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Ahnab Rashid",
    "Computer Science student",
    "Artificial Intelligence",
    "AI Agents",
    "AI Chatbots",
    "Intelligent Automation",
    "Python",
    "portfolio",
  ],
  authors: [{ name: "Ahnab Rashid" }],
  creator: "Ahnab Rashid",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/ar-icon.svg",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Ahnab Rashid — Portfolio",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ahnab Rashid — Computer Science student exploring AI, AI Agents, AI Chatbots and automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#070B16",
  width: "device-width",
  initialScale: 1,
};

/** Person structured data — truthful, source-backed facts only. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ahnab Rashid",
  jobTitle: "Computer Science Student",
  description:
    "Computer Science student exploring Artificial Intelligence, AI Agents, AI Chatbots, intelligent automation and Python through learning and projects.",
  url: SITE_URL,
  image: `${SITE_URL}/og-image.png`,
  email: "nabi41538@gmail.com",
  sameAs: [
    "https://www.linkedin.com/in/ahnab-rashid",
    "https://github.com/Ahnab-Qureshii",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Abbottabad University of Science and Technology",
  },
  knowsAbout: [
    "Artificial Intelligence",
    "AI Agents",
    "AI Chatbots",
    "Intelligent Automation",
    "Python",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Havelian",
    addressRegion: "Khyber Pakhtunkhwa",
    addressCountry: "PK",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
