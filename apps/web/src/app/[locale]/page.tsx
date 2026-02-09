'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Boxes, DollarSign, Wallet, Brain, Globe, TrendingUp, Search, User, ChevronDown, Check, Plus, Minus, Menu, X } from 'lucide-react';
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

  const isZh = locale === 'zh';

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
      setProducts(response.data);
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

  const faqs = isZh ? [
    { q: '我如何注册或登录？', a: '点击右上角的"登录/注册"按钮，使用邮箱注册新账户或登录现有账户。' },
    { q: '我如何创建和发布我的技能文件？', a: '登录后，前往"技能发布"页面，填写技能信息、设置价格、上传文件即可提交审核。' },
    { q: '平台如何收费？', a: '我们采用极低的平台服务费，让创作者获得最大收益。具体费率请查看技能发布页。' },
    { q: '支持哪些支付方式？', a: '目前支持 USDT/USDC 等主流加密货币，买家直接支付到您的钱包地址。' },
    { q: '如何保护我的知识产权？', a: '平台采用区块链技术进行版权确权，智能合约保障交易安全。' },
  ] : [
    { q: 'How do I register or log in?', a: 'Click the "Login / Register" button in the top right corner to create a new account with your email or sign in to an existing account.' },
    { q: 'How do I create and publish my skill?', a: 'After logging in, go to the "Publish Skill" page, fill in your skill details, set your price, upload your files, and submit for review.' },
    { q: 'What are the platform fees?', a: 'We charge minimal platform fees to maximize creator earnings. Check the Publish Skill page for specific rates.' },
    { q: 'What payment methods are supported?', a: 'We currently support major cryptocurrencies like USDT/USDC. Buyers pay directly to your wallet address.' },
    { q: 'How is my intellectual property protected?', a: 'The platform uses blockchain technology for copyright verification, with smart contracts ensuring secure transactions.' },
  ];

  const demoProducts = isZh ? [
    { title: '智能文案撰写助手', author: '李明', price: 99, category: '文本生成', color: 'bg-amber-100' },
    { title: '科幻场景生成器', author: '王晓华', price: 129, category: '图像创作', color: 'bg-purple-100' },
    { title: '商业数据洞察', author: '张伟', price: 150, category: '数据分析', color: 'bg-blue-100' },
    { title: '多语种语音克隆', author: '陈静', price: 199, category: '语音合成', color: 'bg-pink-100' },
    { title: 'Python 自动化脚本', author: '刘强', price: 89, category: '编程开发', color: 'bg-green-100' },
    { title: 'AI 法律顾问 Prompt', author: '赵敏', price: 299, category: '法律咨询', color: 'bg-red-100' },
    { title: '跨境电商选品模型', author: '孙浩', price: 199, category: '电商运营', color: 'bg-orange-100' },
    { title: '虚拟人直播配置', author: '周杰', price: 350, category: '直播技术', color: 'bg-indigo-100' },
  ] : [
    { title: 'Smart Copywriting Assistant', author: 'Alex Chen', price: 99, category: 'Text Generation', color: 'bg-amber-100' },
    { title: 'Sci-Fi Scene Generator', author: 'Maria Wang', price: 129, category: 'Image Creation', color: 'bg-purple-100' },
    { title: 'Business Data Insights', author: 'James Liu', price: 150, category: 'Data Analysis', color: 'bg-blue-100' },
    { title: 'Multi-Language Voice Clone', author: 'Sarah Kim', price: 199, category: 'Voice Synthesis', color: 'bg-pink-100' },
    { title: 'Python Automation Script', author: 'David Liu', price: 89, category: 'Development', color: 'bg-green-100' },
    { title: 'AI Legal Advisor Prompt', author: 'Emily Zhao', price: 299, category: 'Legal', color: 'bg-red-100' },
    { title: 'Cross-border E-commerce Model', author: 'Kevin Sun', price: 199, category: 'E-commerce', color: 'bg-orange-100' },
    { title: 'Virtual Streamer Setup', author: 'Jay Zhou', price: 350, category: 'Live Streaming', color: 'bg-indigo-100' },
  ];

  const steps = isZh ? [
    { icon: Wallet, num: '01', title: '创建账户', desc: '注册您的账户，开启智慧创造者之旅' },
    { icon: Brain, num: '02', title: '封装智慧', desc: '将你的天赋与知识技能转化为AI 智能体可使用的技能功能' },
    { icon: Globe, num: '03', title: '轻松发布', desc: '利用平台的功能，轻松将您的技能知识产权，发布到全球市场' },
    { icon: TrendingUp, num: '04', title: '建立品牌', desc: '随着您的客户规模的成长，让您的知识产权为您带来长期且稳定的被动收入。' },
  ] : [
    { icon: Wallet, num: '01', title: 'Create Account', desc: 'Register your account and start your journey as a wisdom creator.' },
    { icon: Brain, num: '02', title: 'Package Wisdom', desc: 'Transform your talents and knowledge into functional skills usable by AI agents.' },
    { icon: Globe, num: '03', title: 'Easy Publish', desc: 'Use platform features to easily publish your intellectual property to the global market.' },
    { icon: TrendingUp, num: '04', title: 'Build Your Brand', desc: 'As your client base grows, let your intellectual property bring you long-term, stable passive income.' },
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
              {isZh ? '首页' : 'Home'}
            </Link>
            <Link
              href="/products"
              className="hover:text-purple-600 transition"
              onClick={() => trackEvent({ event_name: 'click_nav_explore', element_id: 'nav_explore' })}
            >
              {isZh ? '技能探索' : 'Explore'}
            </Link>
            <a
              href="#"
              onClick={(e) => {
                handlePublishClick(e);
                trackEvent({ event_name: 'click_nav_publish', element_id: 'nav_publish' });
              }}
              className="hover:text-purple-600 transition cursor-pointer"
            >
              {isZh ? '技能发布' : 'Publish Skill'}
            </a>
            <Link href="#faq" className="hover:text-purple-600 transition">
              {isZh ? '常见问题' : 'FAQ'}
            </Link>
          </div>

          {/* Right: Search + Login */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center relative">
              <Search className="absolute left-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder={isZh ? '搜索技能...' : 'Search skills...'}
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
                  {isZh ? '登录 / 注册' : 'Login / Register'}
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
          <div className="md:hidden border-t border-gray-200 bg-white px-6 py-4 space-y-4 shadow-lg h-[calc(100vh-64px)] overflow-y-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder={isZh ? '搜索技能...' : 'Search skills...'}
                className="pl-9 bg-gray-100 border-gray-200 focus-visible:ring-purple-500 rounded-lg h-10 w-full text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-900 font-medium py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                {isZh ? '首页' : 'Home'}
              </Link>
              <Link href="/products" className="text-gray-600 py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                {isZh ? '技能探索' : 'Explore'}
              </Link>
              <a href="#" onClick={(e) => { handlePublishClick(e); setMobileMenuOpen(false); }} className="text-gray-600 py-2 border-b border-gray-100">
                {isZh ? '技能发布' : 'Publish Skill'}
              </a>
              <Link href={`/${locale}/blog`} className="text-gray-600 py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                {isZh ? '博客' : 'Blog'}
              </Link>
              <Link href="#faq" className="text-gray-600 py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                {isZh ? '常见问题' : 'FAQ'}
              </Link>
              <Link href={`/${locale}/about`} className="text-gray-600 py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                {isZh ? '关于我们' : 'About Us'}
              </Link>
              <Link href={`/${locale}/contact`} className="text-gray-600 py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                {isZh ? '联系我们' : 'Contact Us'}
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
                {isZh ? '登录 / 注册' : 'Login / Register'}
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
      <section className="pt-24 pb-12 md:pt-32 md:pb-20 px-6 bg-gradient-to-br from-white via-gray-50 to-purple-50/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-gray-900">
                {t('hero.title')}
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t('hero.subtitle')}
              </p>

              <div className="flex gap-4 justify-center lg:justify-start">
                <Button
                  className="h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 text-base font-medium shadow-lg shadow-purple-200"
                  onClick={handlePublishClick}
                >
                  {isZh ? '技能发布' : 'Publish Skill'}
                </Button>
                <Link href="#explore">
                  <Button variant="outline" className="h-12 border-2 border-purple-200 text-purple-600 hover:bg-purple-50 rounded-full px-8 text-base font-medium">
                    {isZh ? '探索技能' : 'Explore Skills'}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Laptop Mockup - Hidden on Mobile */}
            <div className="relative hidden lg:block">
              <div className="bg-gradient-to-br from-purple-100/50 to-blue-100/50 rounded-3xl p-8">
                <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
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
                  <div className="bg-gray-900 p-4 min-h-[200px]">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-purple-600/20 rounded-lg p-3">
                        <div className="text-purple-400 text-xs mb-1">{isZh ? '总收益' : 'Revenue'}</div>
                        <div className="text-white font-bold">$52,598</div>
                      </div>
                      <div className="bg-blue-600/20 rounded-lg p-3">
                        <div className="text-blue-400 text-xs mb-1">{isZh ? '订单数' : 'Orders'}</div>
                        <div className="text-white font-bold">36</div>
                      </div>
                      <div className="bg-emerald-600/20 rounded-lg p-3">
                        <div className="text-emerald-400 text-xs mb-1">{isZh ? '技能数' : 'Skills'}</div>
                        <div className="text-white font-bold">62</div>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-gray-400 text-xs mb-2">{isZh ? '我的技能' : 'My Skills'}</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white">{isZh ? '智能文案撰写助手' : 'Smart Copywriting Assistant'}</span>
                          <span className="text-purple-400">$99</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white">{isZh ? '科幻场景生成器' : 'Sci-Fi Scene Generator'}</span>
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
                {isZh ? (
                  <>作为<span className="text-purple-600 font-medium">商业技能平台</span>的标准，这里可以获得<span className="text-purple-600 font-medium">各类AI智能体</span>所需的<span className="text-purple-600 font-medium">各领域技能</span>。</>
                ) : (
                  <>As the standard for <span className="text-purple-600 font-medium">commercial skill platforms</span>, access skills across <span className="text-purple-600 font-medium">all domains</span> required by <span className="text-purple-600 font-medium">various AI agents</span>.</>
                )}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-24 h-24 mx-auto mb-6 bg-purple-50 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-gray-900">{t('hero.tag2_title')}</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {isZh ? (
                  <>为了<span className="text-purple-600 font-medium">AI科技</span>与<span className="text-purple-600 font-medium">人类共赢</span>，我们将努力将<span className="text-purple-600 font-medium">交易成本</span>做到<span className="text-purple-600 font-medium">最低</span>。</>
                ) : (
                  <>For the mutual benefit of <span className="text-purple-600 font-medium">AI technology</span> and <span className="text-purple-600 font-medium">humanity</span>, we strive to keep <span className="text-purple-600 font-medium">transaction costs</span> to the <span className="text-purple-600 font-medium">absolute minimum</span>.</>
                )}
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
            {isZh ? '最新上架' : 'Latest Arrivals'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition group">
                    <div className="relative">
                      <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                        {demo.category}
                      </span>
                      <div className={`h-40 ${demo.color} flex items-center justify-center`}>
                        <Brain className="w-16 h-16 text-purple-300" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition">{demo.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">{isZh ? '创作者：' : 'By '}{demo.author}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-purple-600">${demo.price}.00</span>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full text-xs px-4">
                          {isZh ? '查看详情' : 'View'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="text-center mt-10">
            <Link href="/products">
              <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 rounded-full px-8">
                {isZh ? '查看全部 →' : 'View All →'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Start Your Journey (Fixed Responsive Wrapping) */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              {isZh ? '开启智慧之旅' : 'Start Your Journey'}
            </h2>
            <p className="text-base md:text-xl text-gray-500 max-w-2xl mx-auto font-medium px-4 md:px-0">
              {isZh ? '只需简单四个步骤，将您的知识转化为持续的数字收益' : 'Four simple steps to transform your knowledge into sustainable digital revenue.'}
            </p>
          </div>

          {/* Steps Row with Visual Connectors */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {/* Desktop Horizontal Connector Line */}
            <div className="hidden md:block absolute top-[52px] left-[15%] right-[15%] h-[2px] z-0 opacity-20" 
                 style={{ backgroundImage: 'linear-gradient(to right, #7c3aed 50%, transparent 50%)', backgroundSize: '12px 100%' }} />

            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group relative z-10">
                {/* Step Icon Container */}
                <div className="relative mb-8">
                  {/* Outer White Card-like Circle */}
                  <div className="w-[100px] h-[100px] md:w-[110px] md:h-[110px] bg-white rounded-3xl flex items-center justify-center shadow-[0_8px_30px_rgb(124,58,237,0.12)] border border-purple-50 group-hover:shadow-[0_12px_40px_rgb(124,58,237,0.2)] transition-all duration-300 transform group-hover:-translate-y-1">
                    <step.icon className="w-10 h-10 text-purple-600" strokeWidth={2} />
                  </div>
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white">
                    {step.num}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed px-6 md:px-4">
                  {step.desc}
                </p>
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
              {isZh ? '最新动态' : 'Latest from Blog'}
            </h2>
            <div className="w-16 h-1 bg-purple-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BlogSection locale={locale} />
          </div>

          <div className="text-center mt-12">
            <Link href={`/${locale}/blog`}>
              <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 rounded-full px-8">
                {isZh ? '阅读更多文章 →' : 'Read More Articles →'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section (Fixed Mobile Width) */}
      <section id="faq" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-purple-600">
            {isZh ? '常见问题' : 'Frequently Asked Questions'}
          </h2>
          <div className="w-16 h-1 bg-purple-600 mx-auto mb-12"></div>

          <div className="space-y-4 w-full">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl overflow-hidden w-full"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-gray-50 transition"
                  aria-expanded={openFaq === idx}
                >
                  <span className="font-semibold text-gray-900 leading-snug pr-4">{faq.q}</span>
                  {openFaq === idx ? (
                    <Minus className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 md:px-6 md:pb-6 text-gray-600 text-sm md:text-base leading-relaxed border-t border-gray-50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4 text-sm md:text-base">
              {isZh ? '还有其他问题？' : 'Still have questions?'}
            </p>
            <Link href={`/${locale}/contact`}>
              <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 rounded-full px-8">
                {isZh ? '联系我们' : 'Contact Us'}
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
                {isZh ? 'AI驱动的专业技能变现平台' : 'AI-powered professional skill monetization platform'}
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-white mb-4">{isZh ? '产品' : 'Product'}</h4>
              <div className="space-y-2 text-sm">
                <Link href="/products" className="block text-gray-400 hover:text-purple-400 transition">{isZh ? '技能探索' : 'Explore Skills'}</Link>
                <a href="#" onClick={handlePublishClick} className="block text-gray-400 hover:text-purple-400 transition cursor-pointer">{isZh ? '技能发布' : 'Publish Skill'}</a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">{isZh ? '资源' : 'Resources'}</h4>
              <div className="space-y-2 text-sm">
                <Link href={`/${locale}/blog`} className="block text-gray-400 hover:text-purple-400 transition">{isZh ? '博客' : 'Blog'}</Link>
                <Link href="#faq" className="block text-gray-400 hover:text-purple-400 transition">{isZh ? '帮助中心' : 'Help Center'}</Link>
                <Link href="#" className="block text-gray-400 hover:text-purple-400 transition">{isZh ? '开发者文档' : 'Developer Docs'}</Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">{isZh ? '关于' : 'About'}</h4>
              <div className="space-y-2 text-sm">
                <Link href={`/${locale}/about`} className="block text-gray-400 hover:text-purple-400 transition">{isZh ? '关于我们' : 'About Us'}</Link>
                <Link href={`/${locale}/contact`} className="block text-gray-400 hover:text-purple-400 transition">{isZh ? '联系我们' : 'Contact'}</Link>
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
