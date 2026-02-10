'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Boxes, Wallet, Shield, Globe, Lock, Users, Package, MapPin, DollarSign } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('AboutPage');
  const locale = useLocale();
  const isZh = locale === 'zh';

  const whyItems = [
    { icon: Wallet, title: t('why1_title'), desc: t('why1_desc'), color: 'bg-emerald-50 text-emerald-600' },
    { icon: Shield, title: t('why2_title'), desc: t('why2_desc'), color: 'bg-blue-50 text-blue-600' },
    { icon: Globe, title: t('why3_title'), desc: t('why3_desc'), color: 'bg-purple-50 text-purple-600' },
    { icon: Lock, title: t('why4_title'), desc: t('why4_desc'), color: 'bg-amber-50 text-amber-600' },
  ];

  const stats = [
    { value: '500+', label: t('stats_products'), icon: Package },
    { value: '2,000+', label: t('stats_users'), icon: Users },
    { value: '30+', label: t('stats_countries'), icon: MapPin },
    { value: '$100K+', label: t('stats_payout'), icon: DollarSign },
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
            <Link href={`/${locale}/help`} className="text-gray-600 hover:text-purple-600 transition">
              {isZh ? '帮助中心' : 'Help Center'}
            </Link>
            <Link href={`/${locale}/contact`} className="text-gray-600 hover:text-purple-600 transition">
              {isZh ? '联系我们' : 'Contact'}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-6 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg text-purple-200">{t('subtitle')}</p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-0 px-6">
        <div className="container mx-auto max-w-4xl -mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 text-center shadow-lg border border-gray-100">
                <stat.icon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('mission_title')}</h2>
              <p className="text-gray-600 leading-relaxed">{t('mission_desc')}</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🔭</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('vision_title')}</h2>
              <p className="text-gray-600 leading-relaxed">{t('vision_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why MySkillStore */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t('why_title')}</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {whyItems.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-6 rounded-xl border border-gray-100 hover:shadow-md transition">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('team_title')}</h2>
          <p className="text-gray-600 leading-relaxed text-lg">{t('team_desc')}</p>
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
