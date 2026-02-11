'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/components/auth/AuthContext';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Boxes, Search, User, Brain, ChevronDown, Check, Menu, X } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  description: string;
  price_usd: number;
  category: string;
  preview_url: string | null;
  seller: {
    id: number;
    nickname?: string;
    email: string;
  };
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
  const { isLoggedIn, user, openAuthModal } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 12;

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  ];

  const currentLang = languages.find(l => l.code === locale) || languages[0];

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

  const fetchProducts = async (searchQuery = '', categoryFilter = 'all') => {
    try {
      setLoading(true);
      const params: any = { status: 'approved' };
      if (searchQuery) params.search = searchQuery;
      if (categoryFilter !== 'all') params.category = categoryFilter;

      const response = await api.get('/products', { params });
      setProducts(response.data.items || response.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts(search, category);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setCurrentPage(1);
    fetchProducts(search, newCategory);
  };

  const handlePublishClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openAuthModal('login');
      return;
    }
    router.push(`/${locale}/products/create`);
  };

  const filteredProducts = products;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Brand + Language */}
          <div className="flex items-center gap-4">
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
              <Link href={`/${locale}`} className="text-lg font-bold text-gray-900">
                {t('nav.brand')}
              </Link>
            </div>

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
                      href={`/${lang.code}/products`}
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

          {/* Center: Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href={`/${locale}`} className="hover:text-purple-600 transition">
              {t('nav.home')}
            </Link>
            <Link
              href={`/${locale}/products`}
              className="text-purple-600 font-medium border-b-2 border-purple-600 pb-5 -mb-5"
            >
              {t('nav.explore')}
            </Link>
            <a
              href="#"
              onClick={handlePublishClick}
              className="hover:text-purple-600 transition cursor-pointer"
            >
              {t('nav.publishSkill')}
            </a>
            <Link href={`/${locale}#faq`} className="hover:text-purple-600 transition">
              {t('nav.faq')}
            </Link>
          </div>

          {/* Right: User Section */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link href={`/${locale}/user`}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-200">
                    <span className="text-purple-600 font-semibold text-sm">
                      {(user?.nickname || user?.email || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                    {user?.nickname || user?.email?.split('@')[0] || t('nav.profile')}
                  </span>
                </div>
              </Link>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg h-10 px-4 text-sm hidden sm:flex"
                  onClick={() => openAuthModal('login')}
                >
                  {t('nav.loginRegister')}
                </Button>
                <div
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition sm:hidden"
                  onClick={() => openAuthModal('login')}
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
            <div className="flex flex-col space-y-4">
              <Link href={`/${locale}`} className="text-gray-600 py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.home')}
              </Link>
              <Link href={`/${locale}/products`} className="text-gray-900 font-medium py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.explore')}
              </Link>
              <a href="#" onClick={(e) => { handlePublishClick(e); setMobileMenuOpen(false); }} className="text-gray-600 py-2 border-b border-gray-100">
                {t('nav.publishSkill')}
              </a>
              <Link href={`/${locale}#faq`} className="text-gray-600 py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.faq')}
              </Link>
            </div>

            <div className="pt-2 border-t border-gray-100 mt-2">
              <button
                onClick={() => setMobileLangOpen(!mobileLangOpen)}
                className="flex items-center justify-between w-full py-2 text-sm text-gray-500"
              >
                <span>Language ({currentLang.label})</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileLangOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileLangOpen && (
                <div className="mt-2 space-y-2">
                  {languages.map(lang => (
                    <Link
                      key={lang.code}
                      href={`/${lang.code}/products`}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg ${locale === lang.code ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-50 text-gray-700'}`}
                      onClick={() => { setMobileLangOpen(false); setMobileMenuOpen(false); }}
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
        )}
      </nav>

      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t('sections.latestArrivals')}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {locale === 'zh' ? '发现由全球创作者打造的优质AI技能、提示词和工作流' : 'Discover quality AI skills, prompts and workflows built by creators worldwide'}
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder={t('nav.searchPlaceholder')}
                  className="pl-10 h-12 bg-white border-gray-200 focus-visible:ring-purple-500 rounded-xl"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button
                className="h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
            <Button
              className="h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6"
              onClick={handlePublishClick}
            >
              {t('nav.publishSkill')}
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  category === cat.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300'
                }`}
              >
                {locale === 'zh' ? cat.labelZh : cat.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={String(product.id)}
                    title={product.title}
                    price={Number(product.price_usd)}
                    author={product.seller?.nickname || product.seller?.email || 'Anonymous'}
                    coverUrl={product.preview_url || undefined}
                    category={product.category}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="border-gray-300 disabled:opacity-50 rounded-lg"
                  >
                    {locale === 'zh' ? '上一页' : 'Previous'}
                  </Button>

                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? 'bg-purple-600 hover:bg-purple-700 rounded-lg' : 'border-gray-300 rounded-lg'}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="border-gray-300 disabled:opacity-50 rounded-lg"
                  >
                    {locale === 'zh' ? '下一页' : 'Next'}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {locale === 'zh' ? '暂无技能' : 'No Skills Found'}
              </h3>
              <p className="text-gray-500">
                {locale === 'zh' ? '尝试调整搜索条件或类别筛选' : 'Try adjusting your search or category filter'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-[#1a1a2e] text-center">
        <p className="text-gray-500 text-sm">© 2026 MySkillStore. All rights reserved.</p>
      </footer>
    </div>
  );
}
