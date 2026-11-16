import React from 'react';
import './globals.css';
import { AuthProvider } from '../lib/context/AuthContext';
import { ScrollProgressBar } from '../components/animations/ScrollProgressBar';
import { InteractiveBackground } from '../components/animations/InteractiveBackground';
import { Footer } from '../components/layout/Footer';
import { CookieConsentBanner } from '../components/layout/CookieConsentBanner';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saarthi-ai.vercel.app';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Saarthi AI — Student Roadmap & Government Scheme Matcher',
    template: '%s | Saarthi AI',
  },
  description:
    'Deterministic government scheme & scholarship eligibility matcher and personalized semester-by-semester student career roadmap engine for Indian citizens.',
  keywords: [
    'Saarthi AI',
    'Government Schemes India',
    'Scholarships',
    'National Scholarship Portal',
    'myScheme',
    'Career Roadmap',
    'Eligibility Checker',
    'AICTE Pragati',
    'PM-KISAN',
    'Indian Students',
  ],
  authors: [{ name: 'Saarthi AI Team' }],
  creator: 'Saarthi AI',
  publisher: 'Saarthi AI Civic Initiative',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    title: 'Saarthi AI — Student Roadmap & Government Scheme Matcher',
    description:
      'Discover 5,080+ Indian scholarships and welfare schemes with deterministic eligibility and personalized student roadmaps.',
    siteName: 'Saarthi AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saarthi AI — Student Roadmap & Government Scheme Matcher',
    description:
      'Discover 5,080+ Indian scholarships and welfare schemes with deterministic eligibility and personalized student roadmaps.',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1A1715" />
      </head>
      <body className="bg-[#F5F2EC] text-[#1A1715] antialiased min-h-screen selection:bg-[#D5C3A5]/40 selection:text-[#1A1715] relative overflow-x-hidden flex flex-col">
        <ScrollProgressBar />
        <InteractiveBackground />
        <AuthProvider>
          <div className="flex-1 flex flex-col min-h-screen justify-between">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
          <CookieConsentBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
