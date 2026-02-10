'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Boxes, ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function HelpCenterPage() {
  const t = useTranslations('HelpCenter');
  const locale = useLocale();
  const isZh = locale === 'zh';
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
    { q: t('q5'), a: t('a5') },
    { q: t('q6'), a: t('a6') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <Link href={`/${locale}`} className="text-lg font-bold text-gray-900">
              MySkillStore
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href={`/${locale}`} className="text-gray-600 hover:text-purple-600 transition">
              {isZh ? '首页' : 'Home'}
            </Link>
            <Link href={`/${locale}/about`} className="text-gray-600 hover:text-purple-600 transition">
              {isZh ? '关于我们' : 'About'}
            </Link>
            <Link href={`/${locale}/contact`} className="text-gray-600 hover:text-purple-600 transition">
              {isZh ? '联系我们' : 'Contact'}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-12 px-6 bg-gradient-to-br from-purple-50 to-white">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-lg text-gray-600">{t('subtitle')}</p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition"
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-purple-600 flex-shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Still need help */}
          <div className="text-center mt-16 p-8 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <MessageCircle className="w-10 h-10 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('still_need_help')}</h3>
            <Link href={`/${locale}/contact`}>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 mt-4">
                {t('contact_us')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#1a1a2e] text-center">
        <div className="text-gray-500 text-sm">
          © 2026 MySkillStore. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
