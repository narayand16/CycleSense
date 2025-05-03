import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import labels from '@/lib/labels.json';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: labels.app.seo.title,
  description: labels.app.seo.description,
  keywords: labels.app.seo.keywords,
  openGraph: {
    title: labels.app.seo.title,
    description: labels.app.description,
    type: 'website',
  },
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}