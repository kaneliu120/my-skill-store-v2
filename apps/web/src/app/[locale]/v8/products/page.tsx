'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  Search, Star, ShoppingCart, Filter, ChevronDown, Check, ArrowUpDown, Boxes, ArrowRight, X
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
        <div className="absolute bottom-4 right-4 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 z-10">
          <button className="bg-white p-3 rounded-full shadow-lg text-slate-900 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 shadow-sm">
          {category}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors h-[3.5rem]">
          {title}
        </h3>
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
        <div className="my-4 h-px w-full bg-slate-100" />
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">One-time</span>
            <span className="text-xl font-bold text-slate-900">${price}</span>
          </div>
          <span className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-1 group/btn">
            Details <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// --- V8 Products Page ---

export default function ProductsPageV8() {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const isZh = locale === 'zh';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle

  // Categories Data
  const categories = [
    { id: 'all', label: isZh ? '全部' : 'All', count: 128 },
    { id: 'prompts', label: isZh ? 'AI 提示词' : 'AI Prompts', count: 45 },
    { id: 'agents', label: isZh ? 'AI 智能体' : 'AI Agents', count: 32 },
    { id: 'workflows', label: isZh ? '工作流' : 'Workflows', count: 24 },
    { id: 'code', label: isZh ? '代码模板' : 'Code Templates', count: 18 },
    { id: 'design', label: isZh ? '设计资产' : 'Design Assets', count: 9 },
  ];

  // Demo Data
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products', {
          params: { status: 'approved' }
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter Logic
  const filteredProducts = (products.length > 0 ? products : demoProducts as any[]).filter(p => {
    const matchCategory = category === 'all' || (p.category && p.category.toLowerCase().includes(category === 'prompts' ? 'prompt' : category));
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    // const matchPrice = Number(p.price || p.price_usd) >= priceRange[0] && Number(p.price || p.price_usd) <= priceRange[1];
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Navbar (Simplified for internal page) */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-3">
          <Link href="/v8" className="flex items-center gap-2 text-slate-900 font-bold">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Boxes className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline">MySkillStore</span>
          </Link>
          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
          <div className="text-sm font-medium text-slate-500 hidden sm:block">
            {isZh ? '技能市场' : 'Marketplace'}
          </div>
        </div>
        
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={isZh ? "搜索..." : "Search..."}
              className="w-full h-10 pl-9 pr-4 rounded-lg bg-slate-100 border-none text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/v8/products/create">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
              {isZh ? '发布' : 'Sell'}
            </Button>
          </Link>
          <Link href="/user">
            <Button variant="ghost" size="sm" className="text-slate-600">
              {isZh ? '登录' : 'Login'}
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="flex items-center gap-2"><Filter className="w-4 h-4" /> {isZh ? '筛选' : 'Filters'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className={`w-full md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="sticky top-24 space-y-8">
              
              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                  {isZh ? '分类' : 'Categories'}
                </h3>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        category === cat.id 
                          ? 'bg-indigo-50 text-indigo-700 font-medium' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat.label}
                      <span className="text-xs text-slate-400 bg-white border border-slate-100 px-1.5 py-0.5 rounded-md">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter (Visual Only for V8 Demo) */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                  {isZh ? '价格范围' : 'Price Range'}
                </h3>
                <div className="px-2">
                   {/* Placeholder Slider */}
                   <div className="h-1 bg-slate-200 rounded-full mb-4 relative">
                     <div className="absolute left-0 w-1/2 h-full bg-indigo-600 rounded-full"></div>
                     <div className="absolute left-1/2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full -top-1.5 shadow cursor-pointer"></div>
                   </div>
                   <div className="flex items-center justify-between text-xs text-slate-500">
                     <span>$0</span>
                     <span>$1000+</span>
                   </div>
                </div>
              </div>

              {/* Rating Filter */}
               <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                  {isZh ? '评分' : 'Rating'}
                </h3>
                <div className="space-y-2">
                  {[5, 4, 3].map(stars => (
                    <label key={stars} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900">
                      <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? 'fill-current' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">& Up</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            
            {/* Header: Breadcrumbs & Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold text-slate-900">
                {category === 'all' 
                  ? (isZh ? '所有技能' : 'All Skills') 
                  : categories.find(c => c.id === category)?.label}
                <span className="ml-2 text-base font-normal text-slate-500">
                  ({filteredProducts.length} {isZh ? '个结果' : 'results'})
                </span>
              </h1>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 hidden sm:inline">{isZh ? '排序:' : 'Sort by:'}</span>
                <div className="relative group">
                  <button className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                    {isZh ? '最新发布' : 'Newest'} <ChevronDown className="w-4 h-4" />
                  </button>
                  {/* Dropdown would go here */}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ModernProductCard 
                  key={product.id} 
                  id={product.id.toString()}
                  title={product.title}
                  price={Number((product as any).price_usd || (product as any).price)}
                  authorName={(product as any).seller?.nickname || (product as any).author || 'Anonymous'}
                  category={product.category || 'Other'}
                  imageUrl={product.image_url}
                  rating={(product as any).rating || 5.0} 
                  reviews={(product as any).reviews || 0} 
                />
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <Button variant="outline" disabled className="w-10 h-10 p-0 text-slate-400">←</Button>
                <Button className="w-10 h-10 p-0 bg-indigo-600 text-white">1</Button>
                <Button variant="outline" className="w-10 h-10 p-0 text-slate-600 hover:bg-slate-50">2</Button>
                <Button variant="outline" className="w-10 h-10 p-0 text-slate-600 hover:bg-slate-50">3</Button>
                <span className="px-2 text-slate-400">...</span>
                <Button variant="outline" className="w-10 h-10 p-0 text-slate-600 hover:bg-slate-50">→</Button>
              </nav>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
