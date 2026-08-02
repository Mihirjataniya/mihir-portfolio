import type { Metadata, Viewport } from "next";
import { Grenze_Gotisch, IBM_Plex_Mono, Playfair_Display } from "next/font/google";
import { SITE } from "@/data/site";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Variable font (wght 100–900), so no `weight` — the nameplate dials it in CSS.
const grenzeGotisch = Grenze_Gotisch({
  subsets: ["latin"],
  variable: "--font-grenze",
  display: "swap",
});

export const metadata: Metadata = {
  // Every relative URL in metadata (OG images especially) resolves against
  // this. Without it Next falls back to localhost and ships dead social cards.
  metadataBase: new URL(SITE.url),
  title: {
    // The name leads: it is the query this site most needs to win, and search
    // results truncate from the right.
    default: `${SITE.author} · ${SITE.name}`,
    // Pages set a bare title; the byline is appended here so it can never drift.
    template: `%s · ${SITE.author}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.author, url: SITE.url }],
  creator: SITE.author,
  publisher: SITE.author,
  alternates: { canonical: "/" },
  openGraph: {
    siteName: SITE.name,
    title: `${SITE.author} · ${SITE.name}`,
    description: "A personal engineering newspaper. Published irregularly from Ahmedabad.",
    url: SITE.url,
    locale: SITE.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: `@${SITE.twitterHandle}`,
    creator: `@${SITE.twitterHandle}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f2e9",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${plexMono.variable} ${grenzeGotisch.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
