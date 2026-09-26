import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://muhammad-talib.dev"),
  title: "Muhammad Talib Ibrahim — Full Stack Developer",
  description:
    "Full Stack Developer specializing in MERN & Next.js. Building scalable web apps, real-time systems, and AI-powered tools. Based in Lahore, Pakistan.",
  keywords: [
    "Muhammad Talib Ibrahim",
    "Full Stack Developer",
    "MERN",
    "Next.js",
    "React",
    "Node.js",
    "Portfolio",
  ],
  authors: [{ name: "Muhammad Talib Ibrahim" }],
  openGraph: {
    title: "Muhammad Talib Ibrahim — Full Stack Developer",
    description:
      "Building scalable web apps with modern JavaScript. MERN & Next.js specialist.",
    url: "https://muhammad-talib.dev",
    siteName: "Muhammad Talib Ibrahim Portfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Talib Ibrahim — Full Stack Developer",
    description:
      "Building scalable web apps with modern JavaScript. MERN & Next.js specialist.",
  },
  verification: {
    // Replace with your Google Search Console verification code if you are not using domain (DNS) verification
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

import UnifiedDock from "@/components/UnifiedDock";
import AssistantPrompt from "@/components/AssistantPrompt";
import { ModeProvider } from "@/context/ModeContext";
import { IntensityProvider } from "@/context/IntensityContext";
import { ThemeSystemProvider } from "@/context/ThemeSystemContext";
import { Inter, Oswald, Rajdhani, Silkscreen } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-rajdhani" });
const silkscreen = Silkscreen({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-silkscreen" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} ${rajdhani.variable} ${silkscreen.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var p = window.location.pathname;
                  var t = 'minimal';
                  if (p.startsWith('/neon')) t = 'neon';
                  else if (p.startsWith('/m-sport')) t = 'msport';
                  else if (p.startsWith('/nothing')) t = 'nothing';
                  else if (p.startsWith('/apple')) t = 'apple';
                  else if (p.startsWith('/recruiter')) t = 'recruiter';
                  else if (p === '/' || p === '/minimal') t = 'minimal';
                  else t = localStorage.getItem('portfolio_visual_theme') || 'minimal';
                  
                  var applePref = localStorage.getItem('apple_mode_preference');
                  var generalPref = localStorage.getItem('portfolio_color_mode');
                  var m = 'dark';
                  if (p.startsWith('/apple')) {
                    m = applePref || generalPref || 'light';
                  } else {
                    m = generalPref || 'dark';
                  }
                  document.documentElement.setAttribute('data-theme', t);
                  document.documentElement.setAttribute('data-mode', m);
                  document.documentElement.setAttribute('data-theme-variant', t + '-' + m);
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Muhammad Talib Ibrahim",
              jobTitle: "Full Stack Developer",
              url: "https://muhammad-talib.dev",
              email: "talibibrahim04@gmail.com",
              sameAs: [
                "https://github.com/TalibIbrahim",
                "https://www.linkedin.com/in/muhammad-talib-ibrahim",
              ],
            }),
          }}
        />
      </head>
      <body>
        <ModeProvider>
          <IntensityProvider>
            <ThemeSystemProvider>
              {children}
              <AssistantPrompt />
              <UnifiedDock />
            </ThemeSystemProvider>
          </IntensityProvider>
        </ModeProvider>
        <Analytics />
      </body>
    </html>
  );
}
