import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import AuthWrapper from "@/components/auth/AuthWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://myskillstore.dev'),
  title: {
    template: '%s | MySkillStore',
    default: 'MySkillStore - C2C AI Skill Marketplace',
  },
  description: "The premier marketplace for AI skills, prompts, agents, and workflows. Buy and sell high-quality AI assets securely.",
  openGraph: {
    title: 'MySkillStore - C2C AI Skill Marketplace',
    description: 'Buy and sell AI skills, prompts, and agents. Monetize your AI expertise today.',
    url: 'https://myskillstore.dev',
    siteName: 'MySkillStore',
    images: [
      {
        url: '/og-image.jpg', // Ensure this file exists in public/
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MySkillStore - AI Skill Marketplace',
    description: 'Premier marketplace for AI assets.',
    creator: '@myskillstore',
  },
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'zh': '/zh',
    },
  },
};

import { PageTracker } from '@/components/tracking/PageTracker';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <AuthWrapper>
            <PageTracker />
            {children}
          </AuthWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
