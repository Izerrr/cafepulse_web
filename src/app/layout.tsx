import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'CafePulse — Work-Friendly Spaces & Verified Cafe Directory',
  description:
    'Curated directory of work-ready cafes with verified high-speed Wi-Fi, power plug availability, and live crowd density metrics. Editorial neo-brutalist edition.',
  keywords: [
    'work friendly cafe',
    'coworking space',
    'wifi cafe',
    'surakarta cafe',
    'remote work coffee',
    'cafepulse',
  ],
  authors: [{ name: 'CafePulse Studio' }],
  openGraph: {
    title: 'CafePulse — Find Your Pulse. Coffee & Coworking.',
    description:
      'Verified Wi-Fi speeds, plug capacity, and live crowd density for remote workers and coffee lovers.',
    url: 'https://cafepulse.izerworks.my.id',
    siteName: 'CafePulse',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Syne:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0F0D0C] text-[#F7F3EE] antialiased selection:bg-[#E08E45] selection:text-[#0F0D0C]">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

