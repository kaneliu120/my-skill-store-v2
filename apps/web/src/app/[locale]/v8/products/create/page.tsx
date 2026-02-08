'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, CheckCircle, ChevronRight, Upload, DollarSign, Image as ImageIcon, Box, Boxes 
} from "lucide-react";
import api from '@/lib/api';

// --- Components ---

function ModernProductCardPreview({ 
  title, 
  price, 
  category 
}: { 
  title: string, 
  price: string, 
  category: string 
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl max-w-sm mx-auto transform scale-90 sm:scale-100 transition-transform origin-top">
      <div className="relative aspect-[4/3] bg-slate-100 flex items-center justify-center">
        <ImageIcon className="w-12 h-12 text-slate-300" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 shadow-sm">
          {category || 'Category'}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-2 h-[3.5rem]">
          {title || 'Your Product Title Here'}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
           <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded-full bg-indigo-100"></div>
             <span className="text-sm text-slate-400">You</span>
           </div>
           <span className="text-xl font-bold text-slate-900">${price || '0'}</span>
        </div>
      </div>
    </div>
  );
}

// --- V8 Create Product Page ---

export default function CreateProductPageV8() {
  const t = useTranslations('CreateProduct');
  const locale = useLocale();
  const isZh = locale === 'zh';
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    deliveryMethod: 'auto',
    walletAddress: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const steps = [
    { num: 1, title: isZh ? '基本信息' : 'Basics', desc: isZh ? '描述你的产品' : 'Describe your product' },
    { num: 2, title: isZh ? '定价与交付' : 'Pricing', desc: isZh ? '设置价格' : 'Set your price' },
    { num: 3, title: isZh ? '收款方式' : 'Payment', desc: isZh ? '接收资金' : 'Receive funds' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row">
      
      {/* Left Sidebar: Progress & Navigation (Fixed on Desktop) */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-200 p-6 md:h-screen sticky top-0 z-20 flex flex-col justify-between">
        <div>
          <Link href="/v8" className="flex items-center gap-2 font-bold text-slate-900 mb-8 md:mb-12">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Boxes className="w-5 h-5" />
            </div>
            <span>MySkillStore</span>
          </Link>
          
          <nav className="space-y-6 md:space-y-8 relative">
            {/* Vertical Line */}
            <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-100 -z-10 hidden md:block"></div>
            
            {steps.map((s) => (
              <div key={s.num} className={`flex items-start gap-4 transition-colors ${step === s.num ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${step >= s.num ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">{s.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.desc}</div>
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-8 md:mt-0 pt-6 border-t border-slate-100 hidden md:block">
           <Link href="/v8/products" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
             <ArrowLeft className="w-4 h-4" /> {isZh ? '取消并返回' : 'Cancel & Exit'}
           </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 lg:p-20 overflow-y-auto">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Form Area */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Step 1: Basics */}
            {step === 1 && (
              <>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">{isZh ? '首先，告诉我们你要卖什么' : 'First, tell us what you\'re selling'}</h1>
                  <p className="text-slate-500">{isZh ? '准确的标题和分类能帮助买家更快找到你。' : 'Accurate titles and categories help buyers find you faster.'}</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{isZh ? '产品标题' : 'Product Title'}</label>
                    <Input 
                      name="title" 
                      value={formData.title} 
                      onChange={handleChange} 
                      placeholder={isZh ? "例如：Midjourney 人像提示词包 v2" : "e.g. Midjourney Portrait Prompts v2"} 
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{isZh ? '分类' : 'Category'}</label>
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleChange} 
                      className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                    >
                      <option value="">{isZh ? '选择分类...' : 'Select category...'}</option>
                      <option value="Prompt">AI Prompts</option>
                      <option value="Code">Code & Templates</option>
                      <option value="Workflow">Workflows</option>
                      <option value="Dataset">Datasets</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{isZh ? '描述' : 'Description'}</label>
                    <Textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange} 
                      placeholder={isZh ? "详细描述你的产品包含什么..." : "Describe what's included in detail..."} 
                      className="bg-white min-h-[150px]"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Pricing */}
            {step === 2 && (
              <>
                 <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">{isZh ? '这值多少钱？' : 'How much is it worth?'}</h1>
                  <p className="text-slate-500">{isZh ? '设置一个公平的价格。您可以随时更改。' : 'Set a fair price. You can change this anytime.'}</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{isZh ? '价格 (USD)' : 'Price (USD)'}</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        name="price" 
                        type="number"
                        value={formData.price} 
                        onChange={handleChange} 
                        placeholder="49" 
                        className="pl-9 bg-white text-lg font-bold"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{isZh ? '由于是去中心化交易，您将收到 100% 的款项（减去极低的 Gas 费）。' : 'Since this is decentralized, you receive 100% of the payment (minus minimal gas fees).'}</p>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-4">{isZh ? '上传文件' : 'Upload File'}</label>
                     <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6 text-indigo-600" />
                        </div>
                        <p className="font-medium text-slate-900">{isZh ? '点击或拖拽上传' : 'Click or drag to upload'}</p>
                        <p className="text-xs text-slate-500 mt-1">ZIP, PDF, JSON up to 50MB</p>
                     </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <>
                 <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">{isZh ? '最后，您如何收款？' : 'Finally, how do you get paid?'}</h1>
                  <p className="text-slate-500">{isZh ? '输入您的钱包地址以接收 USDT/USDC。' : 'Enter your wallet address to receive USDT/USDC.'}</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{isZh ? 'USDT/USDC 钱包地址' : 'USDT/USDC Wallet Address'}</label>
                    <Input 
                      name="walletAddress" 
                      value={formData.walletAddress} 
                      onChange={handleChange} 
                      placeholder="0x..." 
                      className="bg-white font-mono text-sm"
                    />
                    <div className="flex gap-2 mt-2">
                       <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600">ERC20</span>
                       <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600">TRC20</span>
                       <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600">BEP20</span>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                     <div className="flex-shrink-0 w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center text-amber-700 font-bold text-xs">!</div>
                     <p className="text-xs text-amber-800 leading-relaxed">
                       {isZh ? '请务必仔细检查地址。区块链交易不可逆转。如果是第一次使用，建议先进行小额测试。' : 'Please double check your address. Blockchain transactions are irreversible. Test with a small amount first.'}
                     </p>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-8">
              {step > 1 && (
                <Button variant="outline" onClick={handleBack} className="px-6 h-12 text-base">
                  {isZh ? '上一步' : 'Back'}
                </Button>
              )}
              {step < 3 ? (
                <Button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 text-base rounded-full shadow-lg shadow-indigo-200 flex-1 sm:flex-none">
                  {isZh ? '继续' : 'Continue'} <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 h-12 text-base rounded-full shadow-lg shadow-green-200 flex-1 sm:flex-none">
                  {isZh ? '提交发布' : 'Publish Product'}
                </Button>
              )}
            </div>

          </div>

          {/* Right Column: Preview Area (Sticky) */}
          <div className="hidden lg:block">
            <div className="sticky top-32">
               <div className="text-center mb-6">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isZh ? '实时预览' : 'Live Preview'}</h3>
               </div>
               <ModernProductCardPreview 
                 title={formData.title} 
                 price={formData.price} 
                 category={formData.category} 
               />
               <div className="text-center mt-8 px-8">
                 <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                   <Box className="w-3 h-3" />
                   {isZh ? '您的产品将出现在 V8 市场首页' : 'Your product will be featured on V8 Marketplace'}
                 </div>
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
