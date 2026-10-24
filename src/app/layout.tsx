import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'cafepulse. — Direktori Ruang Kerja & Kafe Ramah Laptop di Surakarta',
  description:
    'Direktori independen kafe ramah kerja di Surakarta. Dilengkapi data uji kecepatan Wi-Fi, ketersediaan colokan per meja, dan tingkat kebisingan lapangan.',
  keywords: [
    'cafepulse',
    'cafe nugas solo',
    'work friendly cafe surakarta',
    'wifi cepat cafe solo',
    'coworking space solo',
    'tempat kerja remote surakarta',
  ],
  authors: [{ name: 'CafePulse Team' }],
  openGraph: {
    title: 'cafepulse. — Direktori Ruang Kerja & Kafe Ramah Laptop',
    description:
      'Data kurasi kafe ramah kerja di Surakarta. Uji nyata Wi-Fi, colokan, dan tingkat keramaian.',
    url: 'https://cafepulse.izerworks.my.id',
    siteName: 'cafepulse.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-canvas-bg text-roast-900 antialiased selection:bg-crema-500 selection:text-white">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
