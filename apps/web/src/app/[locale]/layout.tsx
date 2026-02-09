import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { Metadata } from "next";
import { Inter, Noto_Sans_SC, Noto_Sans_JP, Noto_Sans_KR } from "next/font/google";
import "../globals.css";
import AuthWrapper from "@/components/auth/AuthWrapper";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const notoSansSC = Noto_Sans_SC({ subsets: ["latin"], weight: ['400', '500', '700'], variable: '--font-noto-sc' });
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ['400', '500', '700'], variable: '--font-noto-jp' });
const notoSansKR = Noto_Sans_KR({ subsets: ["latin"], weight: ['400', '500', '700'], variable: '--font-noto-kr' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://myskillstore.dev'),
  title: {
    template: '%s | MySkillStore',
    default: 'MySkillStore - C2C AI Skill Marketplace',
  },
  description: "The premier marketplace for AI skills, prompts, agents, and workflows. Buy and sell high-quality AI assets securely.",
  keywords: ['AI skills', 'prompt marketplace', 'AI agents', 'buy AI prompts', 'sell AI skills', 'ChatGPT prompts', 'Midjourney prompts', 'AI workflows'],
  authors: [{ name: 'MySkillStore Team' }],
  creator: 'MySkillStore',
  publisher: 'MySkillStore',
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
        alt: 'MySkillStore Preview',
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
    images: ['/og-image.jpg'],
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
    <html lang={locale} className={`${inter.variable} ${notoSansSC.variable} ${notoSansJP.variable} ${notoSansKR.variable}`}>
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
