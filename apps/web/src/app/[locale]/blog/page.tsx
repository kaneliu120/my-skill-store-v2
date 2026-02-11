'use client';

import { useEffect, useState, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Boxes, Calendar, User, ArrowRight, ChevronDown, Check, Menu, X } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  author: string;
  published_at: string;
  status: string;
}

export default function BlogPage() {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const router = useRouter();
  const { isLoggedIn, user, openAuthModal } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const postsPerPage = 9;

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
    fetchPosts();
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

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blog', { params: { status: 'published' } });
      setPosts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openAuthModal('login');
      return;
    }
    router.push(`/${locale}/products/create`);
  };

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
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
                      href={`/${lang.code}/blog`}
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
            <Link href={`/${locale}/products`} className="hover:text-purple-600 transition">
              {t('nav.explore')}
            </Link>
            <a
              href="#"
              onClick={handlePublishClick}
              className="hover:text-purple-600 transition cursor-pointer"
            >
              {t('nav.publishSkill')}
            </a>
            <Link
              href={`/${locale}/blog`}
              className="text-purple-600 font-medium border-b-2 border-purple-600 pb-5 -mb-5"
            >
              {t('nav.blog')}
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
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg h-10 px-4 text-sm"
                onClick={() => openAuthModal('login')}
              >
                {t('nav.loginRegister')}
              </Button>
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
              <Link href={`/${locale}/products`} className="text-gray-600 py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.explore')}
              </Link>
              <a href="#" onClick={(e) => { handlePublishClick(e); setMobileMenuOpen(false); }} className="text-gray-600 py-2 border-b border-gray-100">
                {t('nav.publishSkill')}
              </a>
              <Link href={`/${locale}/blog`} className="text-gray-900 font-medium py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.blog')}
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
                      href={`/${lang.code}/blog`}
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

      {/* Blog Content */}
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {locale === 'zh' ? 'MySkillStore 博客' : 'MySkillStore Blog'}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {locale === 'zh'
                ? '发现AI领域的最新趋势，学习如何将您的技能变现，获取平台功能更新。'
                : 'Discover the latest trends in AI, learn how to monetize your skills, and get updates on our platform features.'}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : paginatedPosts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {paginatedPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition flex flex-col h-full border-gray-200 bg-white">
                    {post.cover_image && (
                      <div className="h-48 overflow-hidden rounded-t-xl">
                        <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(post.published_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl line-clamp-2">
                        <Link href={`/${locale}/blog/${post.slug || post.id}`} className="hover:text-purple-600 transition">
                          {post.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
                        {post.excerpt || post.content.substring(0, 150) + '...'}
                      </p>
                      <Link href={`/${locale}/blog/${post.slug || post.id}`} className="w-full">
                        <Button variant="outline" className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 group rounded-lg">
                          {locale === 'zh' ? '阅读文章' : 'Read Article'}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
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
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500">
                {locale === 'zh' ? '暂无已发布的文章，请稍后查看！' : 'No posts published yet. Check back soon!'}
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
