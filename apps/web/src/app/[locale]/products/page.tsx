'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Boxes, Search, User, Brain, Menu, X, ChevronDown, Check } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
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

const CATEGORIES = [
  { id: 'all', label: 'All', labelZh: '全部' },
  { id: 'prompts', label: 'Prompts', labelZh: '提示词' },
  { id: 'agents', label: 'AI Agents', labelZh: 'AI代理' },
  { id: 'workflows', label: 'Workflows', labelZh: '工作流' },
  { id: 'code', label: 'Code', labelZh: '代码' },
  { id: 'design', label: 'Design', labelZh: '设计' },
  { id: 'data', label: 'Datasets', labelZh: '数据集' },
];

export default function ProductsPage() {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const router = useRouter();
  const { isLoggedIn, user, openAuthModal, requireAuth } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    } finally {
      setLoading(false);
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

  const filteredProducts = products.filter(p => {
    const matchCategory = category === 'all' || p.category === category;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const demoProducts = isZh ? [
    { title: '智能文案撰写助手', author: '李明', price: 99, category: '文本生成', color: 'bg-amber-100' },
    { title: '科幻场景生成器', author: '王晓华', price: 129, category: '图像创作', color: 'bg-purple-100' },
    { title: '商业数据洞察', author: '张伟', price: 150, category: '数据分析', color: 'bg-blue-100' },
    { title: '多语种语音克隆', author: '陈静', price: 199, category: '语音合成', color: 'bg-pink-100' },
  ] : [
    { title: 'Smart Copywriting Assistant', author: 'Alex Chen', price: 99, category: 'Text Generation', color: 'bg-amber-100' },
    { title: 'Sci-Fi Scene Generator', author: 'Maria Wang', price: 129, category: 'Image Creation', color: 'bg-purple-100' },
    { title: 'Business Data Insights', author: 'James Liu', price: 150, category: 'Data Analysis', color: 'bg-blue-100' },
    { title: 'Multi-Language Voice Clone', author: 'Sarah Kim', price: 199, category: 'Voice Synthesis', color: 'bg-pink-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar (首页同款) */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Boxes className="w-5 h-5 text-white" />
              </div>
              <Link href={`/${locale}`} className="text-lg font-bold text-gray-900">
                {t('nav.brand')}
              </Link>
            </div>
            <div className="relative hidden sm:block" ref={langRef}>
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
                <span>{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px] max-h-[300px] overflow-y-auto z-[60]">
                  {languages.map(lang => (
                    <Link key={lang.code} href={`/${lang.code}/products`} className={`flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 ${locale === lang.code ? 'text-purple-600 bg-purple-50' : 'text-gray-700'}`} onClick={() => setLangOpen(false)}>
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                      {locale === lang.code && <Check className="w-4 h-4 ml-auto" />}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href={`/${locale}`} className="hover:text-purple-600 transition">{isZh ? '首页' : 'Home'}</Link>
            <Link href={`/${locale}/products`} className="text-purple-600 font-medium border-b-2 border-purple-600 pb-5 -mb-5">{isZh ? '技能探索' : 'Explore'}</Link>
            <a href="#" onClick={handlePublishClick} className="hover:text-purple-600 transition cursor-pointer">{isZh ? '技能发布' : 'Publish Skill'}</a>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link href={`/${locale}/user`}>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-200">
                  <span className="text-purple-600 font-semibold text-sm">{(user?.nickname || 'U')[0].toUpperCase()}</span>
                </div>
              </Link>
            ) : (
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg h-10 px-4 text-sm" onClick={() => openAuthModal('login')}>
                {isZh ? '登录 / 注册' : 'Login / Register'}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-6 py-4 space-y-4 shadow-lg h-[calc(100vh-64px)] overflow-y-auto">
            <div className="flex flex-col space-y-4">
              <Link href={`/${locale}`} className="text-gray-900 font-medium py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>{isZh ? '首页' : 'Home'}</Link>
              <Link href={`/${locale}/products`} className="text-purple-600 py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>{isZh ? '技能探索' : 'Explore'}</Link>
              <a href="#" onClick={(e) => { handlePublishClick(e); setMobileMenuOpen(false); }} className="text-gray-600 py-2 border-b border-gray-100">{isZh ? '技能发布' : 'Publish Skill'}</a>
            </div>
            <div className="pt-2 border-t border-gray-100 mt-2">
              <button onClick={() => setMobileLangOpen(!mobileLangOpen)} className="flex items-center justify-between w-full py-2 text-sm text-gray-500">
                <span>Language ({currentLang.label})</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileLangOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileLangOpen && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {languages.map(lang => (
                    <Link key={lang.code} href={`/${lang.code}/products`} className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border ${locale === lang.code ? 'border-purple-200 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-600'}`} onClick={() => setMobileMenuOpen(false)}>
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{isZh ? '探索 AI 技能' : 'Explore AI Skills'}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">{isZh ? '发现由全球创作者打造的优质 AI 技能、提示词和工作流' : 'Discover quality AI skills, prompts and workflows built by creators worldwide'}</p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                placeholder={isZh ? '搜索技能...' : 'Search skills...'} 
                className="pl-12 h-14 bg-white border-gray-200 focus-visible:ring-purple-500 rounded-2xl shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-10">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  category === cat.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
                }`}
              >
                {isZh ? cat.labelZh : cat.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} id={String(p.id)} title={p.title} price={p.price_usd} author={p.seller?.nickname || 'Creator'} category={p.category} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {demoProducts.map((demo, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-48 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
                    <Brain className="w-16 h-16 text-purple-200 group-hover:scale-110 transition-transform duration-500" />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-purple-600 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">{demo.category}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">{demo.title}</h3>
                    <p className="text-xs text-gray-400 mb-4">{isZh ? 'By' : 'By'} {demo.author}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">${demo.price}</span>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-5 text-xs font-bold">
                        {isZh ? '详情' : 'View'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-[#1a1a2e] border-t border-gray-800 text-center">
        <p className="text-gray-500 text-sm">© 2026 MySkillStore. All rights reserved.</p>
      </footer>
    </div>
  );
}
