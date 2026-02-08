'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { 
  Search, Star, ShoppingCart, CheckCircle, ShieldCheck, Zap, 
  Boxes, ChevronDown, Check, Menu, X, ArrowRight
} from "lucide-react";
import api from '@/lib/api';

// --- Types ---
interface Product {
  id: number;
  title: string;
  price_usd: number;
  seller: { nickname: string };
  category: string;
  image_url?: string;
}

// --- Components ---
function ModernProductCard({ 
  id, 
  title, 
  price, 
  authorName, 
  rating = 5.0, 
  reviews = 0,
  imageUrl, 
  category 
}: { 
  id: string, 
  title: string, 
  price: number, 
  authorName: string, 
  rating?: number, 
  reviews?: number,
  imageUrl?: string, 
  category: string 
}) {
  return (
    <Link href={`/v8/products/${id}`} className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 transition-all hover:shadow-xl hover:-translate-y-1 h-full">
      {/* Image Area - 4:3 Aspect Ratio */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            <Boxes className="w-12 h-12 text-indigo-200" />
          </div>
        )}
        
        {/* Floating Cart Button */}
        <div className="absolute bottom-4 right-4 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 z-10">
          <button className="bg-white p-3 rounded-full shadow-lg text-slate-900 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 shadow-sm">
          {category}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors h-[3.5rem]">
          {title}
        </h3>

        {/* Author & Rating */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-200">
              {authorName[0]?.toUpperCase()}
            </div>
            <span className="text-sm text-slate-500 truncate max-w-[80px]">{authorName}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium text-slate-700">{rating}</span>
            {reviews > 0 && <span className="text-xs text-slate-400">({reviews})</span>}
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px w-full bg-slate-100" />

        {/* Price Area */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">One-time</span>
            <span className="text-xl font-bold text-slate-900">${price}</span>
          </div>
          <span className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-1 group/btn">
            View Details <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// --- V8 Home Page ---

export default function HomePageV8() {
  const t = useTranslations('HomePage'); // Still use HomePage translations for basic strings
  const locale = useLocale();
  const isZh = locale === 'zh';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

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
  ];
  const currentLang = languages.find(l => l.code === locale) || languages[0];

  const demoProducts = [
    { id: 101, title: isZh ? '智能文案撰写助手' : 'Smart Copywriting Assistant', price: 99, author: 'Alex Chen', category: 'Prompt', rating: 4.9, reviews: 128 },
    { id: 102, title: isZh ? 'Next.js SaaS 启动模板' : 'Next.js SaaS Starter Kit', price: 149, author: 'Code Master', category: 'Code', rating: 5.0, reviews: 85 },
    { id: 103, title: isZh ? 'Midjourney 肖像提示词包' : 'Midjourney Portrait Prompts', price: 29, author: 'Art AI', category: 'Prompt', rating: 4.8, reviews: 210 },
    { id: 104, title: isZh ? '自动化 SEO 工作流' : 'Automated SEO Workflow', price: 79, author: 'Growth Hacker', category: 'Workflow', rating: 4.7, reviews: 56 },
    { id: 105, title: isZh ? '跨境电商数据分析脚本' : 'E-commerce Data Script', price: 59, author: 'Data Wizard', category: 'Code', rating: 4.9, reviews: 92 },
    { id: 106, title: isZh ? '虚拟人直播配置全套' : 'Virtual Streamer Setup', price: 299, author: 'Live Tech', category: 'Tech', rating: 4.6, reviews: 34 },
    { id: 107, title: isZh ? 'Notion 人生管理系统' : 'Notion Life OS', price: 39, author: 'Productivity', category: 'Template', rating: 5.0, reviews: 300 },
    { id: 108, title: isZh ? 'UI 设计系统 Figma 源文件' : 'UI Design System Figma', price: 89, author: 'Design Pro', category: 'Design', rating: 4.8, reviews: 150 },
  ];

  const categories = isZh ? 
    ['全部', 'AI 提示词', '代码模板', '工作流', '设计资产'] : 
    ['All', 'AI Prompts', 'Code Templates', 'Workflows', 'Design Assets'];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Navbar V8 */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-200 fixed w-full z-50 transition-all duration-300">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Boxes className="w-5 h-5" />
            </div>
            <Link href="/v8" className="text-xl font-bold tracking-tight text-slate-900">
              MySkillStore <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded ml-2">V8 Beta</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/v8" className="text-indigo-600 hover:text-indigo-700">{isZh ? '首页' : 'Home'}</Link>
            <Link href="/v8/products" className="hover:text-indigo-600 transition-colors">{isZh ? '技能探索' : 'Explore'}</Link>
            <Link href="/v8/products/create" className="hover:text-indigo-600 transition-colors">{isZh ? '技能发布' : 'Publish'}</Link>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative hidden sm:block" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              >
                <span>{currentLang.flag}</span>
                <span className="hidden lg:inline">{currentLang.label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[140px] animate-in fade-in zoom-in-95 duration-200">
                  {languages.map(lang => (
                    <Link
                      key={lang.code}
                      href={`/${lang.code}/v8`}
                      className={`flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 ${locale === lang.code ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-700'}`}
                      onClick={() => setLangOpen(false)}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                      {locale === lang.code && <Check className="w-3 h-3 ml-auto" />}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/user">
              <Button variant="ghost" className="hidden sm:flex text-slate-600 hover:text-indigo-600 hover:bg-indigo-50">
                {isZh ? '登录' : 'Log in'}
              </Button>
            </Link>
            <Link href="/v8/products/create">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-5 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5">
                {isZh ? '发布技能' : 'Start Selling'}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section V8 */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-8 border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            {isZh ? '全球首个 AI 技能去中心化交易平台' : 'The First Decentralized AI Skill Marketplace'}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.15] animate-in fade-in slide-in-from-bottom-5 duration-1000 fill-mode-backwards delay-100">
            {isZh ? '发现并获取' : 'Discover & Acquire'} <br className="hidden md:block" />
            <span className="text-indigo-600 relative inline-block whitespace-nowrap">
              {isZh ? '顶尖的数字技能' : 'Top-Tier Digital Skills'}
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            {t('hero.subtitle')}
          </p>

          <div className="relative max-w-xl mx-auto mb-12 group animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-20 group-hover:opacity-30 blur transition duration-500"></div>
            <div className="relative flex items-center bg-white rounded-full shadow-xl shadow-indigo-100/50 p-2 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow">
              <Search className="w-5 h-5 text-slate-400 ml-4 flex-shrink-0" />
              <input 
                type="text" 
                placeholder={isZh ? "搜索技能 (例如: Next.js 模板, SEO Prompt)..." : "Search skills (e.g. Next.js Template)..."}
                className="flex-1 border-none outline-none px-4 text-slate-700 placeholder:text-slate-400 h-10 bg-transparent min-w-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
              />
              <Button onClick={() => fetchProducts(search)} className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 md:px-8 h-10 transition-transform active:scale-95">
                {isZh ? '搜索' : 'Search'}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-slate-500 font-medium animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              {isZh ? '人工审核上架' : 'Curated Content'}
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              {isZh ? '即时自动交付' : 'Instant Delivery'}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {isZh ? '7天退款保证' : 'Money Back Guarantee'}
            </div>
          </div>
        </div>
      </section>

      {/* Categories V8 */}
      <section className="border-b border-slate-200 bg-white sticky top-16 z-40 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 md:pb-0 md:justify-center">
             {categories.map((cat, idx) => (
               <button 
                 key={idx} 
                 className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                   idx === 0 
                     ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                     : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent hover:border-slate-200'
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>
        </div>
      </section>

      {/* Products Grid V8 */}
      <section className="py-24 px-6 bg-slate-50/50">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{isZh ? '本周精选资源' : 'Featured This Week'}</h2>
              <p className="text-slate-500 text-sm">{isZh ? '由社区评选出的最受欢迎技能' : 'Most popular skills voted by the community'}</p>
            </div>
            <Link href="/v8/products" className="text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1 text-sm group">
              {isZh ? '查看全部' : 'View All'} <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.slice(0, 8).map(product => (
                <ModernProductCard 
                  key={product.id} 
                  id={product.id.toString()}
                  title={product.title}
                  price={Number(product.price_usd)}
                  authorName={product.seller?.nickname || 'Anonymous'}
                  category={product.category || 'Other'}
                  imageUrl={product.image_url}
                  rating={5.0} 
                  reviews={Math.floor(Math.random() * 50)} 
                />
              ))
            ) : (
              demoProducts.map((demo) => (
                <ModernProductCard 
                  key={demo.id} 
                  id={demo.id.toString()}
                  title={demo.title}
                  price={demo.price}
                  authorName={demo.author}
                  category={demo.category}
                  rating={demo.rating}
                  reviews={demo.reviews}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA V8 */}
      <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden relative isolate">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/30 blur-[120px] rounded-full pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none -z-10 -translate-x-1/3 translate-y-1/3" />
         
         <div className="container mx-auto max-w-4xl text-center relative z-10">
           <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
             {isZh ? '准备好出售你的智慧了吗？' : 'Ready to Monetize Your Wisdom?'}
           </h2>
           <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
             {isZh ? '加入 10,000+ 创作者的行列。将你的专业知识打包成产品，建立被动收入流。我们提供最低的手续费和最广的全球市场。' : 'Join 10,000+ creators. Package your expertise into products and build passive income streams. Lowest fees, global reach.'}
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link href="/v8/products/create">
               <Button className="w-full sm:w-auto bg-white text-slate-900 hover:bg-indigo-50 px-8 py-6 rounded-full text-lg font-bold shadow-xl shadow-white/10 transition-transform hover:-translate-y-1">
                 {isZh ? '免费创建店铺' : 'Start Selling for Free'}
               </Button>
             </Link>
             <Link href="/user">
                <Button variant="outline" className="w-full sm:w-auto border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 px-8 py-6 rounded-full text-lg font-medium">
                  {isZh ? '了解更多' : 'Learn More'}
                </Button>
             </Link>
           </div>
           <p className="mt-8 text-sm text-slate-500 font-medium">
             {isZh ? '无需信用卡 · 5分钟完成设置 · 随时提现' : 'No credit card required · 5-min setup · Instant withdrawal'}
           </p>
         </div>
      </section>

      {/* Footer V8 */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-xs">M</div>
              MySkillStore <span className="text-xs font-normal text-slate-400 ml-2">V8 Design</span>
            </div>
            <div className="text-slate-500 text-sm">
              © 2026 MySkillStore. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-slate-500">
               <Link href="#" className="hover:text-indigo-600 transition">{isZh ? '条款' : 'Terms'}</Link>
               <Link href="#" className="hover:text-indigo-600 transition">{isZh ? '隐私' : 'Privacy'}</Link>
               <Link href="#" className="hover:text-indigo-600 transition">{isZh ? '联系' : 'Contact'}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
