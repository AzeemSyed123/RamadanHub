import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ramadan Hub USA - Your Ramadan Companion',
  description: 'Complete Ramadan companion app for American Muslims with prayer times, iftar events, meal plans, and charity tracking.',
  keywords: ['Ramadan', 'Islam', 'Prayer Times', 'Iftar', 'Muslim', 'USA', 'Charity', 'Zakat'],
  authors: [{ name: 'Ramadan Hub USA' }],
  manifest: '/manifest.json',
  themeColor: '#22c55e',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ramadan Hub USA" />
      </head>
      <body>{children}</body>
    </html>
  );
}
