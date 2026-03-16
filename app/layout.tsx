import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'DataPM — Stop Writing Project Docs from Scratch',
  description: 'DataPM generates professional project charters, KPI frameworks, data specs and stakeholder decks — in seconds. Built for Data PMs.',
  metadataBase: new URL('https://datapm-toolkit-v10.vercel.app'),
  openGraph: {
    title: 'DataPM — Stop Writing Project Docs from Scratch',
    description: 'Generate professional PMO artifacts in seconds. Project charters, KPI frameworks, data specs, stakeholder decks.',
    type: 'website',
    url: 'https://datapm-toolkit-v10.vercel.app',
    siteName: 'DataPM',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'DataPM — AI-powered PMO document generation',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DataPM — Stop Writing Project Docs from Scratch',
    description: 'Generate professional PMO artifacts in seconds.',
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/icon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable}`}>
      <body className="bg-brand-base text-brand-text min-h-screen font-body antialiased">
        {children}
      </body>
    </html>
  );
}
