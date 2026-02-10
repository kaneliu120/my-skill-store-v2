'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Boxes, Mail, Send, Clock, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const t = useTranslations('ContactPage');
  const locale = useLocale();
  const isZh = locale === 'zh';
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submit
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setLoading(false);
  };

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
            <Link href={`/${locale}/about`} className="text-gray-600 hover:text-purple-600 transition">
              {isZh ? '关于我们' : 'About'}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-12 px-6 bg-gradient-to-br from-purple-50 to-white">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-lg text-gray-600">{t('subtitle')}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Contact Form */}
            <div className="md:col-span-3">
              {submitted ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {isZh ? '发送成功！' : 'Message Sent!'}
                  </h3>
                  <p className="text-gray-600">{t('form_success')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700">{t('form_name')}</Label>
                      <Input
                        id="name"
                        required
                        placeholder={isZh ? '张三' : 'John Doe'}
                        className="border-gray-200 focus-visible:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">{t('form_email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="border-gray-200 focus-visible:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-700">{t('form_subject')}</Label>
                    <Input
                      id="subject"
                      required
                      placeholder={isZh ? '请输入主题' : 'What is this about?'}
                      className="border-gray-200 focus-visible:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-700">{t('form_message')}</Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      placeholder={isZh ? '请输入您的消息...' : 'Tell us more...'}
                      className="border-gray-200 focus-visible:ring-purple-500 resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg h-11"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {isZh ? '发送中...' : 'Sending...'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        {t('form_submit')}
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info Sidebar */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-5">{t('info_title')}</h3>
                <div className="space-y-5">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{t('email_title')}</div>
                      <div className="text-sm text-gray-500">support@myskillstore.com</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{t('telegram_title')}</div>
                      <div className="text-sm text-gray-500">@myskillstore</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{t('hours_title')}</div>
                      <div className="text-sm text-gray-500">{t('hours_value')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <p className="text-sm text-purple-700">
                  {t('faq_hint')}{' '}
                  <Link href={`/${locale}/help`} className="font-medium underline hover:text-purple-900">
                    {t('faq_link')}
                  </Link>{' '}
                  {t('faq_hint_end')}
                </p>
              </div>
            </div>
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
