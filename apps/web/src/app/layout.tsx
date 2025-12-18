import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Craftixel - From Idea to Pixel-Perfect UI',
  description:
    'AI-powered design system generator. Transform your business ideas into production-ready Figma designs with content strategy, design tokens, and components.',
  keywords: [
    'design system',
    'figma',
    'AI design',
    'UI generator',
    'design tokens',
    'content first',
  ],
  authors: [{ name: 'Craftixel' }],
  openGraph: {
    title: 'Craftixel - From Idea to Pixel-Perfect UI',
    description:
      'AI-powered design system generator. Transform your business ideas into production-ready Figma designs.',
    url: 'https://craftixel.io',
    siteName: 'Craftixel',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Craftixel - From Idea to Pixel-Perfect UI',
    description:
      'AI-powered design system generator. Transform your business ideas into production-ready Figma designs.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
