import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { site } from '@/data/site';
import { BOOT_SCRIPT } from '@/lib/mode-script';
import { Header } from '@/components/chrome/Header';
import { Curtain } from '@/components/chrome/Curtain';
import { RecruiterToggle } from '@/components/chrome/RecruiterToggle';
import { Motion } from '@/components/Motion';
import { azeret, clash, general } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.role}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: './' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en_US',
    url: site.url,
    title: `${site.name} | ${site.role}`,
    description: site.description,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `${site.name}, ${site.role}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} | ${site.role}`,
    description: site.description,
    images: ['/og.png'],
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: '#0b0b0c',
  colorScheme: 'dark light',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  email: `mailto:${site.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Lahore', addressCountry: 'PK' },
  alumniOf: site.education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school })),
  sameAs: [site.links.github.href, site.links.linkedin.href],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${clash.variable} ${general.variable} ${azeret.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Curtain />
        <div id="cursor" aria-hidden="true">
          <span className="cursor__dot" />
          <span className="cursor__label" data-cursor-label />
        </div>
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <RecruiterToggle />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        {process.env.VERCEL && <Analytics />}
        <Motion />
      </body>
    </html>
  );
}
