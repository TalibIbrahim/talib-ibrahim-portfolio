import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { site } from '@/data/site';
import { BOOT_SCRIPT } from '@/lib/mode-script';
import { alternates, ldScript, personLd } from '@/lib/structured-data';
import { Header } from '@/components/chrome/Header';
import { Curtain } from '@/components/chrome/Curtain';
import { Loader } from '@/components/chrome/Loader';
import { RecruiterToggle } from '@/components/chrome/RecruiterToggle';
import { Motion } from '@/components/Motion';
import { clash, general, mono } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.role}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: alternates('./'),
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en_US',
    url: site.url,
    title: `${site.name} | ${site.role}`,
    description: site.description,
    images: [{ url: site.ogImage.src, width: site.ogImage.width, height: site.ogImage.height, alt: site.ogImage.alt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} | ${site.role}`,
    description: site.description,
    images: [site.ogImage.src],
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: '#0b0b0c',
  colorScheme: 'dark light',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${clash.variable} ${general.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Curtain />
        <Loader />
        <div id="cursor" aria-hidden="true">
          <span className="cursor__dot" />
          <span className="cursor__label" data-cursor-label />
        </div>
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <RecruiterToggle />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: ldScript(personLd()) }}
        />
        {process.env.VERCEL && <Analytics />}
        <Motion />
      </body>
    </html>
  );
}
