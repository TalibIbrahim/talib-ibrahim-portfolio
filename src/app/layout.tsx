import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://talibibrahim.dev"),
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
    url: "https://talibibrahim.dev",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('portfolio-theme');
                  if (t) document.documentElement.setAttribute('data-theme', t);
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
              url: "https://talibibrahim.dev",
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
        <div className="grain" aria-hidden="true" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
