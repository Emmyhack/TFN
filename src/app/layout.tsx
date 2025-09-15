import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { MainNavigation } from '@/components/ui/navigation';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TFN - The Fellowship Network',
  description: 'A modern community platform for church and fellowship groups',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div id="root">
            <MainNavigation />
            <main className="min-h-screen pb-16 md:pb-0">
              {children}
            </main>
          </div>
          <div id="portal-root" />
        </Providers>
      </body>
    </html>
  );
}