'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Star, ShoppingCart, CheckCircle, Check, ShieldCheck, Zap, 
  Boxes, ChevronRight, User, Globe, Share2, Heart, ArrowLeft, Download, Eye
} from "lucide-react";
import api from '@/lib/api';
import { useParams } from 'next/navigation';

// --- Components ---
function Badge({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'outline' | 'success' }) {
  const styles = {
    default: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    outline: 'bg-white text-slate-600 border-slate-200',
    success: 'bg-green-50 text-green-700 border-green-100'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]}`}>
      {children}
    </span>
  );
}

// --- V8 Product Detail Page ---

export default function ProductDetailPageV8() {
  const t = useTranslations('ProductDetail');
  const locale = useLocale();
  const isZh = locale === 'zh';
  const params = useParams();
  const id = params.id as string;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Demo Product Data (Fallback)
  const demoProduct = {
    id: id,
    title: isZh ? 'Next.js SaaS 终极启动模板 (2026版)' : 'The Ultimate Next.js SaaS Starter Kit (2026 Edition)',
    price: 149,
    description: isZh 
      ? `## 🚀 为什么选择这个模板？\n\n不再浪费时间在重复的基础设施搭建上。这个模板包含了构建现代 SaaS 所需的一切：\n\n- **Next.js 15 (App Router)**\n- **Tailwind CSS + Shadcn UI**\n- **Stripe & LemonSqueezy 支付集成**\n- **Supabase 数据库与认证**\n- **多语言支持 (i18n)**\n\n适用于想要快速验证想法并开始收费的独立开发者和初创团队。`
      : `## 🚀 Why this starter kit?\n\nStop wasting time on repetitive infrastructure setup. This kit includes everything you need to build a modern SaaS:\n\n- **Next.js 15 (App Router)**\n- **Tailwind CSS + Shadcn UI**\n- **Stripe & LemonSqueezy Integration**\n- **Supabase DB & Auth**\n- **Internationalization (i18n)**\n\nPerfect for indie hackers and startups who want to validate ideas and start charging fast.`,
    category: 'Code',
    image_url: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    reviews: 128,
    sales: 3542,
    updatedAt: '2026-02-01',
    features: [
      isZh ? '包含源代码' : 'Source Code Included',
      isZh ? '终身免费更新' : 'Lifetime Updates',
      isZh ? '商业使用许可' : 'Commercial License',
      isZh ? 'Discord 社区支持' : 'Discord Community Access'
    ],
    seller: {
      id: 1,
      nickname: 'CodeMaster_Alex',
      avatar: 'A',
      joined: '2024',
      verified: true
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product', error);
        // Use demo data on error for preview
        setProduct(demoProduct); 
      } finally {
        setLoading(false);
      }
    };

    if (id && !isNaN(Number(id))) {
      fetchProduct();
    } else {
      setProduct(demoProduct); // Use demo for non-numeric IDs (preview mode)
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Product not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Navbar (Minimal) */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <Link href="/v8/products" className="text-slate-500 hover:text-slate-900 p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-slate-200"></div>
          <Link href="/v8" className="flex items-center gap-2 font-bold text-slate-900">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-xs">M</div>
            <span className="hidden sm:inline">MySkillStore</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:flex text-slate-600 gap-2">
            <Share2 className="w-4 h-4" /> {isZh ? '分享' : 'Share'}
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:flex text-slate-600 gap-2">
            <Heart className="w-4 h-4" /> {isZh ? '收藏' : 'Save'}
          </Button>
          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
          <Link href="/v8/products/create">
             <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
              {isZh ? '我也要卖' : 'Sell Similar'}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
             <Link href="/v8" className="hover:text-indigo-600">Home</Link> 
             <ChevronRight className="w-4 h-4 text-slate-300" />
             <Link href="/v8/products" className="hover:text-indigo-600">{product.category || 'Resources'}</Link>
             <ChevronRight className="w-4 h-4 text-slate-300" />
             <span className="text-slate-900 font-medium truncate max-w-[200px]">{product.title}</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Media & Details (8/12) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Gallery */}
            <div className="relative aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
               {product.image_url ? (
                 <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                    <Boxes className="w-20 h-20 text-indigo-200" />
                 </div>
               )}
               <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2">
                 <Eye className="w-3 h-3" /> Preview
               </div>
            </div>

            {/* Product Info Header */}
            <div>
               <div className="flex flex-wrap gap-2 mb-4">
                 <Badge variant="default">{product.category}</Badge>
                 <Badge variant="success">{isZh ? '即时交付' : 'Instant Delivery'}</Badge>
               </div>
               <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                 {product.title}
               </h1>
               
               <div className="flex items-center gap-6 text-sm text-slate-500 pb-8 border-b border-slate-200">
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="font-bold text-slate-900 ml-1">{product.rating || 5.0}</span>
                    <span className="text-slate-400">({product.reviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" /> 
                    <span>{product.sales || 0} {isZh ? '人已购买' : 'students'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" /> 
                    <span>{isZh ? '最后更新:' : 'Last updated:'} {product.updatedAt || '2026-02-01'}</span>
                  </div>
               </div>
            </div>

            {/* Description Tab */}
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-indigo-600 hover:prose-a:text-indigo-500">
               <h3 className="text-xl font-bold mb-4">{isZh ? '关于此资源' : 'About this resource'}</h3>
               {/* Simulate Markdown Rendering */}
               <div className="whitespace-pre-wrap leading-relaxed text-slate-600">
                 {product.description || 'No description provided.'}
               </div>
            </div>

            {/* Seller Profile */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6 shadow-sm">
               <div className="relative">
                 <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600 border-4 border-indigo-50">
                    {product.seller?.nickname?.[0]?.toUpperCase() || 'A'}
                 </div>
                 {product.seller?.verified && (
                   <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-white">
                     <Check className="w-3 h-3" />
                   </div>
                 )}
               </div>
               <div className="flex-1">
                 <div className="flex items-center justify-between mb-2">
                   <div>
                     <h3 className="font-bold text-slate-900 text-lg">{product.seller?.nickname || 'Anonymous'}</h3>
                     <p className="text-sm text-slate-500">{isZh ? '加入于' : 'Joined'} {product.seller?.joined || '2024'}</p>
                   </div>
                   <Button variant="outline" size="sm" className="hidden sm:flex">{isZh ? '联系卖家' : 'Contact Me'}</Button>
                 </div>
                 <p className="text-slate-600 text-sm leading-relaxed mb-4">
                   {isZh 
                     ? '专注开发高效率的 SaaS 工具和自动化工作流。致力于帮助独立开发者节省时间。' 
                     : 'Focusing on high-efficiency SaaS tools and automation workflows. Dedicated to helping indie developers save time.'}
                 </p>
                 <div className="flex gap-4 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-current" /> 4.9 Seller Rating</div>
                    <div className="flex items-center gap-1"><Globe className="w-3 h-3" /> English, Chinese</div>
                 </div>
               </div>
            </div>

          </div>

          {/* Right Column: Sticky Sidebar (4/12) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              {/* Purchase Card */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-indigo-100/50 overflow-hidden p-6 sm:p-8">
                 <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-extrabold text-slate-900">${product.price_usd || product.price}</span>
                    <span className="text-slate-400 line-through text-sm font-medium">${Number(product.price_usd || product.price) * 1.5}</span>
                 </div>
                 <div className="text-green-600 text-sm font-bold mb-6 bg-green-50 inline-block px-2 py-1 rounded">
                   {isZh ? '限时优惠 33% OFF' : 'Save 33% today'}
                 </div>

                 <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-14 text-lg font-bold shadow-xl shadow-indigo-200 mb-4 transition-transform active:scale-95">
                    {isZh ? '立即购买' : 'Buy Now'}
                 </Button>
                 <p className="text-xs text-center text-slate-400 mb-6">
                   {isZh ? '购买后自动解锁下载链接' : 'Automatic download link after purchase'}
                 </p>

                 <div className="space-y-4 pt-6 border-t border-slate-100">
                    <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">{isZh ? '包含内容' : 'What\'s Included'}</h4>
                    <ul className="space-y-3">
                      {(product.features || demoProduct.features).map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                           <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                           <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                 </div>
              </div>

              {/* Trust Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                 <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                 <h4 className="font-bold text-slate-900 mb-2">{isZh ? '100% 安全支付' : '100% Secure Payment'}</h4>
                 <p className="text-xs text-slate-500 leading-relaxed mb-4">
                   {isZh 
                     ? '您的资金将直接支付给创作者。如果有任何问题，我们的支持团队将在 24 小时内为您解决。' 
                     : 'Your payment goes directly to the creator. Our support team is available 24/7 if you have any issues.'}
                 </p>
                 <div className="flex justify-center gap-2 opacity-50 grayscale">
                    {/* Payment Logos Placeholder */}
                    <div className="h-6 w-10 bg-slate-200 rounded"></div>
                    <div className="h-6 w-10 bg-slate-200 rounded"></div>
                    <div className="h-6 w-10 bg-slate-200 rounded"></div>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer (Minimal) */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 MySkillStore. All rights reserved.</p>
      </footer>

    </div>
  );
}
