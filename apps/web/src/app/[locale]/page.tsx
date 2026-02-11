'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Boxes, DollarSign, FileEdit, Brain, Globe, TrendingUp, Search, User, ChevronDown, Check, Plus, Minus, Menu, X, Wallet, BookOpen } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import BlogSection from '@/components/blog/BlogSection';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/components/auth/AuthContext';
import { trackEvent } from '@/lib/tracking';

interface Product {
  id: number;
  title: string;
  price_usd: number;
  seller: { nickname: string };
  category: string;
}

export default function HomePage() {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const router = useRouter();
  const { isLoggedIn, user, openAuthModal, requireAuth, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const handlePublishClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (requireAuth(() => router.push(`/${locale}/products/create`))) {
      router.push(`/${locale}/products/create`);
    }
  };

  const fetchProducts = async (searchQuery = '') => {
    try {
      const response = await api.get('/products', {
        params: { status: 'approved', search: searchQuery }
      });
      setProducts(response.data.items || response.data || []);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchProducts(search);
    }
  };

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'th', label: 'ไทย', flag: '🇹🇭' },
    { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
    { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  ];

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
  ];

  const demoProducts = [
    { title: t('demo.product1'), author: 'Alex Chen', price: 99, category: t('demo.cat1') },
    { title: t('demo.product2'), author: 'Maria Wang', price: 129, category: t('demo.cat2') },
    { title: t('demo.product3'), author: 'James Liu', price: 150, category: t('demo.cat3') },
    { title: t('demo.product4'), author: 'Sarah Kim', price: 199, category: t('demo.cat4') },
    { title: t('demo.product5'), author: 'David Liu', price: 89, category: t('demo.cat5') },
    { title: t('demo.product6'), author: 'Emily Zhao', price: 299, category: t('demo.cat6') },
    { title: t('demo.product7'), author: 'Kevin Sun', price: 199, category: t('demo.cat7') },
    { title: t('demo.product8'), author: 'Jay Zhou', price: 350, category: t('demo.cat8') },
  ];

  const steps = [
    { icon: FileEdit, num: '01', title: t('howItWorks.step1_title'), desc: t('howItWorks.step1_desc') },
    { icon: Brain, num: '02', title: t('howItWorks.step2_title'), desc: t('howItWorks.step2_desc') },
    { icon: Globe, num: '03', title: t('howItWorks.step3_title'), desc: t('howItWorks.step3_desc') },
    { icon: TrendingUp, num: '04', title: t('howItWorks.step4_title'), desc: t('howItWorks.step4_desc') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Brand + Language Dropdown */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Boxes className="w-5 h-5 text-white" />
              </div>
              <Link href="/" className="text-lg font-bold text-gray-900">
                {t('nav.brand')}
              </Link>
            </div>

            {/* Language Dropdown - Hidden on mobile small screens if needed, or kept */}
            <div className="relative hidden sm:block" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                <span>{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px] max-h-[300px] overflow-y-auto">
                  {languages.map(lang => (
                    <Link
                      key={lang.code}
                      href={`/${lang.code}`}
                      className={`flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 ${locale === lang.code ? 'text-purple-600 bg-purple-50' : 'text-gray-700'}`}
                      onClick={() => setLangOpen(false)}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                      {locale === lang.code && <Check className="w-4 h-4 ml-auto" />}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center: Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href="/" className="text-purple-600 font-medium border-b-2 border-purple-600 pb-5 -mb-5">
              {t('nav.home')}
            </Link>
            <Link
              href="/products"
              className="hover:text-purple-600 transition"
              onClick={() => trackEvent({ event_name: 'click_nav_explore', element_id: 'nav_explore' })}
            >
              {t('nav.explore')}
            </Link>
            <a
              href="#"
              onClick={(e) => {
                handlePublishClick(e);
                trackEvent({ event_name: 'click_nav_publish', element_id: 'nav_publish' });
              }}
              className="hover:text-purple-600 transition cursor-pointer"
            >
              {t('nav.publishSkill')}
            </a>
            <Link href="#faq" className="hover:text-purple-600 transition">
              {t('nav.faq')}
            </Link>
          </div>

          {/* Right: Search + Login */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center relative">
              <Search className="absolute left-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t('nav.searchPlaceholder')}
                className="pl-9 bg-gray-100 border-gray-200 focus-visible:ring-purple-500 rounded-lg h-10 w-64 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                aria-label="Search skills"
              />
            </div>
            {isLoggedIn ? (
              <>
                <Link href="/user">
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg h-10 px-4 text-sm hidden sm:flex">
                    {t('nav.dashboard')}
                  </Button>
                </Link>
                <Link href="/user">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-200">
                    <span className="text-purple-600 font-semibold text-sm">
                      {(user?.nickname || user?.email || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg h-10 px-4 text-sm hidden sm:flex"
                  onClick={() => { openAuthModal('login'); trackEvent({ event_name: 'click_nav_login', element_id: 'nav_login_btn' }); }}
                >
                  {t('nav.loginRegister')}
                </Button>
                <div
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition sm:hidden"
                  onClick={() => { openAuthModal('login'); trackEvent({ event_name: 'click_nav_login_mobile', element_id: 'nav_login_icon' }); }}
                >
                  <User className="w-5 h-5 text-gray-500" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-6 py-4 space-y-4 shadow-lg max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t('nav.searchPlaceholder')}
                className="pl-9 bg-gray-100 border-gray-200 focus-visible:ring-purple-500 rounded-lg h-10 w-full text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-900 font-medium py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.home')}
              </Link>
              <Link href="/products" className="text-gray-600 py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.explore')}
              </Link>
              <a href="#" onClick={(e) => { handlePublishClick(e); setMobileMenuOpen(false); }} className="text-gray-600 py-2 border-b border-gray-100">
                {t('nav.publishSkill')}
              </a>
              <Link href={`/${locale}/blog`} className="text-gray-600 py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.blog')}
              </Link>
              <Link href="#faq" className="text-gray-600 py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.faq')}
              </Link>
              <Link href={`/${locale}/about`} className="text-gray-600 py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.aboutUs')}
              </Link>
              <Link href={`/${locale}/contact`} className="text-gray-600 py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.contactUs')}
              </Link>
            </div>

            {/* Mobile Language Switcher */}
            <div className="pt-2 border-t border-gray-100 mt-2">
              <button
                onClick={() => setMobileLangOpen(!mobileLangOpen)}
                className="flex items-center justify-between w-full py-2 text-sm text-gray-500"
              >
                <span>Language ({currentLang.label})</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileLangOpen && (
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
                  {languages.map(lang => (
                    <Link
                      key={lang.code}
                      href={`/${lang.code}`}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border ${locale === lang.code ? 'border-purple-200 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-600'}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {!isLoggedIn && (
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4"
                onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}
              >
                {t('nav.loginRegister')}
              </Button>
            )}
            {isLoggedIn && (
              <Link href="/user" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-start gap-2 mt-4">
                  <User className="w-4 h-4" />
                  {t('nav.dashboard')}
                </Button>
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-10 md:pt-32 md:pb-20 px-6 bg-gradient-to-br from-white via-gray-50 to-purple-50/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* Left: Text - with border and matching height */}
            <div className="text-center lg:text-left border-4 border-red-500 rounded-2xl p-8 flex flex-col justify-center">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight mb-4 text-gray-900">
                {t('hero.title')}
              </h1>
              <p className="text-base text-gray-600 mb-6 leading-relaxed">
                {t('hero.subtitle')}
              </p>

              <div className="flex gap-4 justify-center lg:justify-start">
                <Button
                  className="h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-full px-7 text-sm font-medium shadow-lg shadow-purple-200"
                  onClick={handlePublishClick}
                >
                  {t('hero.publishSkill')}
                </Button>
                <Link href="#explore">
                  <Button variant="outline" className="h-11 border-2 border-purple-200 text-purple-600 hover:bg-purple-50 rounded-full px-7 text-sm font-medium">
                    {t('hero.exploreSkills')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Laptop Mockup - Hidden on Mobile */}
            <div className="relative hidden lg:block">
              <div className="bg-gradient-to-br from-purple-100/50 to-blue-100/50 rounded-3xl p-8 h-full flex items-center">
                <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl w-full">
                  {/* Browser Chrome */}
                  <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="bg-gray-700 rounded-md px-3 py-1 text-xs text-gray-400 max-w-xs">
                        myskillstore.dev
                      </div>
                    </div>
                  </div>
                  {/* Dashboard Preview */}
                  <div className="bg-gray-900 p-4">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-purple-600/20 rounded-lg p-3">
                        <div className="text-purple-400 text-xs mb-1">{t('hero.revenue')}</div>
                        <div className="text-white font-bold">$52,598</div>
                      </div>
                      <div className="bg-blue-600/20 rounded-lg p-3">
                        <div className="text-blue-400 text-xs mb-1">{t('hero.orders')}</div>
                        <div className="text-white font-bold">36</div>
                      </div>
                      <div className="bg-emerald-600/20 rounded-lg p-3">
                        <div className="text-emerald-400 text-xs mb-1">{t('hero.skills')}</div>
                        <div className="text-white font-bold">62</div>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-gray-400 text-xs mb-2">{t('hero.mySkills')}</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white">{t('hero.demoDashboardSkill1')}</span>
                          <span className="text-purple-400">$99</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white">{t('hero.demoDashboardSkill2')}</span>
                          <span className="text-purple-400">$129</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-100/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-24 h-24 mx-auto mb-6 bg-purple-50 rounded-2xl flex items-center justify-center">
                <Boxes className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-gray-900">{t('hero.tag1_title')}</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {t.rich('hero.feature1_desc', {
                  purple: (chunks) => <span className="text-purple-600 font-medium">{chunks}</span>
                })}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-24 h-24 mx-auto mb-6 bg-purple-50 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-gray-900">{t('hero.tag2_title')}</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {t.rich('hero.feature2_desc', {
                  purple: (chunks) => <span className="text-purple-600 font-medium">{chunks}</span>
                })}
              </p>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="text-center mt-12">
            <div className="text-purple-500 text-sm font-medium mb-2">SCROLL</div>
            <ChevronDown className="w-6 h-6 text-purple-500 mx-auto animate-bounce" />
          </div>
        </div>
      </section>

      {/* Latest Arrivals */}
      <section id="explore" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-purple-600">
            {t('sections.latestArrivals')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.slice(0, 8).map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id.toString()}
                  title={product.title}
                  price={Number(product.price_usd)}
                  author={product.seller?.nickname || 'Anonymous'}
                  category={product.category || 'Other'}
                />
              ))
            ) : (
              /* Demo Cards when no products */
              <>
                {demoProducts.map((demo, idx) => (
                  <ProductCard
                    key={`demo-${idx}`}
                    id={`demo-${idx}`}
                    title={demo.title}
                    price={demo.price}
                    author={demo.author}
                    category={demo.category}
                  />
                ))}
              </>
            )}
          </div>

          <div className="text-center mt-10">
            <Link href="/products">
              <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 rounded-full px-8">
                {t('sections.viewAll')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - Start Your Journey */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
            {t('sections.startJourney')}
          </h2>
          <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto">
            {t('sections.startJourneyDesc')}
          </p>

          {/* Steps Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-6 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center relative">
                {/* Dashed Connector Line (Desktop only, between steps) */}
                {idx < 3 && (
                  <div
                    className="hidden lg:block absolute top-[50px] left-[calc(50%+60px)] z-0"
                    style={{
                      width: 'calc(100% - 120px)',
                      height: '2px',
                      backgroundImage: 'repeating-linear-gradient(to right, #d1d5db 0, #d1d5db 8px, transparent 8px, transparent 16px)',
                    }}
                  />
                )}

                {/* Icon Card */}
                <div className="relative mb-6 z-10">
                  <div className="w-[100px] h-[100px] bg-white rounded-2xl border-2 border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-300">
                    <step.icon className="w-10 h-10 text-purple-600" strokeWidth={1.5} />
                  </div>
                  {/* Numbered Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                    {step.num}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-6 max-w-[220px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('sections.latestBlog')}
            </h2>
            <div className="w-16 h-1 bg-purple-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <BlogSection locale={locale} />
          </div>

          <div className="text-center mt-12">
            <Link href={`/${locale}/blog`}>
              <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 rounded-full px-8">
                {t('sections.readMore')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-purple-600">
            {t('sections.faqTitle')}
          </h2>
          <div className="w-16 h-1 bg-purple-600 mx-auto mb-12"></div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition"
                  aria-expanded={openFaq === idx}
                >
                  <span className="font-medium text-gray-900">{faq.q}</span>
                  {openFaq === idx ? (
                    <Minus className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4">
              {t('sections.stillQuestions')}
            </p>
            <Link href={`/${locale}/contact`}>
              <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 rounded-full px-8">
                {t('sections.contactUs')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Dark Space Gray */}
      <footer className="py-16 bg-[#1a1a2e] text-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Boxes className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">{t('nav.brand')}</span>
              </div>
              <p className="text-sm text-gray-400">
                {t('footer.tagline')}
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-white mb-4">{t('footer.product')}</h4>
              <div className="space-y-2 text-sm">
                <Link href="/products" className="block text-gray-400 hover:text-purple-400 transition">{t('footer.exploreSkills')}</Link>
                <a href="#" onClick={handlePublishClick} className="block text-gray-400 hover:text-purple-400 transition cursor-pointer">{t('footer.publishSkill')}</a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">{t('footer.resources')}</h4>
              <div className="space-y-2 text-sm">
                <Link href={`/${locale}/blog`} className="block text-gray-400 hover:text-purple-400 transition">{t('footer.blog')}</Link>
                <Link href="#faq" className="block text-gray-400 hover:text-purple-400 transition">{t('footer.helpCenter')}</Link>
                <Link href="#" className="block text-gray-400 hover:text-purple-400 transition">{t('footer.developerDocs')}</Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">{t('footer.about')}</h4>
              <div className="space-y-2 text-sm">
                <Link href={`/${locale}/about`} className="block text-gray-400 hover:text-purple-400 transition">{t('footer.aboutUs')}</Link>
                <Link href={`/${locale}/contact`} className="block text-gray-400 hover:text-purple-400 transition">{t('footer.contact')}</Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              © 2026 MySkillStore. All rights reserved.
            </div>
            <div className="flex gap-4 text-sm">
              <Link href="/en" className={`${locale === 'en' ? 'text-purple-400' : 'text-gray-500'} hover:text-purple-400 transition`}>English</Link>
              <Link href="/zh" className={`${locale === 'zh' ? 'text-purple-400' : 'text-gray-500'} hover:text-purple-400 transition`}>中文</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
