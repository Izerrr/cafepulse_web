import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'CafePulse — Curated Workspaces & Remote-Friendly Cafe Directory',
  description:
    'Discover curated, work-optimized cafes in Surakarta. Independently verified for high-speed Wi-Fi, power plug availability, quiet acoustics, and live crowd density.',
  keywords: [
    'cafepulse',
    'work friendly cafe',
    'cafe wifi solo',
    'coworking cafe surakarta',
    'remote work coffee',
  ],
  authors: [{ name: 'CafePulse' }],
  openGraph: {
    title: 'CafePulse — Work-Friendly Spaces & Verified Cafe Directory',
    description:
      'Independently verified Wi-Fi throughput, power socket density, and ambient acoustics for remote workers.',
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
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0B0908] text-[#F9F6F0] antialiased selection:bg-[#E59850] selection:text-[#0B0908]">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
