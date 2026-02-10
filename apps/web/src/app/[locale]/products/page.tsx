'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Boxes, Search, User, Brain } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  image_url: string | null;
  seller_id: number;
  seller: {
    username: string;
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
  const locale = useLocale();
  const isZh = locale === 'zh';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products', {
          params: { status: 'approved' }
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchCategory = category === 'all' || p.category === category;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const demoProducts = isZh ? [
    { title: '智能文案撰写助手', author: '李明', price: 99, category: '文本生成' },
    { title: '科幻场景生成器', author: '王晓华', price: 129, category: '图像创作' },
    { title: '商业数据洞察', author: '张伟', price: 150, category: '数据分析' },
    { title: '多语种语音克隆', author: '陈静', price: 199, category: '语音合成' },
    { title: 'SEO优化写作助手', author: '刘洋', price: 79, category: '文本生成' },
    { title: '代码审查AI', author: '周明', price: 249, category: '代码' },
    { title: '跨境电商选品模型', author: '孙浩', price: 199, category: '电商运营' },
    { title: '虚拟人直播配置', author: '周杰', price: 350, category: '直播技术' },
  ] : [
    { title: 'Smart Copywriting Assistant', author: 'Alex Chen', price: 99, category: 'Text Generation' },
    { title: 'Sci-Fi Scene Generator', author: 'Maria Wang', price: 129, category: 'Image Creation' },
    { title: 'Business Data Insights', author: 'James Liu', price: 150, category: 'Data Analysis' },
    { title: 'Multi-Language Voice Clone', author: 'Sarah Kim', price: 199, category: 'Voice Synthesis' },
    { title: 'SEO Writing Assistant', author: 'David Yang', price: 79, category: 'Text Generation' },
    { title: 'Code Review AI', author: 'Mike Zhou', price: 249, category: 'Code' },
    { title: 'Cross-border E-commerce Model', author: 'Kevin Sun', price: 199, category: 'E-commerce' },
    { title: 'Virtual Streamer Setup', author: 'Jay Zhou', price: 350, category: 'Live Streaming' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <Link href="/" className="text-lg font-bold text-gray-900">
              MySkillStore
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-purple-600 transition">{isZh ? '首页' : 'Home'}</Link>
            <Link href="/products" className="text-purple-600 font-medium">{isZh ? '技能探索' : 'Explore'}</Link>
            <Link href="/products/create" className="hover:text-purple-600 transition">{isZh ? '技能发布' : 'Publish Skill'}</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/user">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg h-10 px-4 text-sm">
                {isZh ? '登录 / 注册' : 'Login / Register'}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {isZh ? '探索AI技能' : 'Explore AI Skills'}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {isZh ? '发现由全球创作者打造的优质AI技能、提示词和工作流' : 'Discover quality AI skills, prompts and workflows built by creators worldwide'}
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                placeholder={isZh ? '搜索技能...' : 'Search skills...'} 
                className="pl-10 h-12 bg-white border-gray-200 focus-visible:ring-purple-500 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link href="/products/create">
              <Button className="h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6">
                {isZh ? '技能发布' : 'Publish Skill'}
              </Button>
            </Link>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  category === cat.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300'
                }`}
              >
                {isZh ? cat.labelZh : cat.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  id={String(product.id)} 
                  title={product.title}
                  price={parseFloat(product.price)}
                  author={product.seller?.username || 'Anonymous'}
                  coverUrl={product.image_url || undefined}
                  category={product.category}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {demoProducts.map((demo, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition group">
                  <div className="relative">
                    <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                      {demo.category}
                    </span>
                    <div className="h-40 bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
                      <Brain className="w-16 h-16 text-purple-300" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition">{demo.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{isZh ? '创作者：' : 'By '}{demo.author}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-purple-600">${demo.price}.00</span>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full text-xs px-4">
                        {isZh ? '查看' : 'View'}
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
      <footer className="py-8 bg-[#1a1a2e] text-center">
        <p className="text-gray-500 text-sm">© 2026 MySkillStore. All rights reserved.</p>
      </footer>
    </div>
  );
}
