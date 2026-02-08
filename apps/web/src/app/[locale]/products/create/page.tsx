'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft, Upload, FileText, Link as LinkIcon, Boxes,
  Wallet, DollarSign, Tag, CheckCircle, Info
} from 'lucide-react';
import api from '@/lib/api';

const CATEGORIES = [
  { id: 'prompts', label: 'Prompts', labelZh: '提示词', icon: '💬' },
  { id: 'agents', label: 'AI Agents', labelZh: 'AI代理', icon: '🤖' },
  { id: 'workflows', label: 'Workflows', labelZh: '工作流', icon: '⚡' },
  { id: 'code', label: 'Code & Scripts', labelZh: '代码脚本', icon: '💻' },
  { id: 'design', label: 'Design Assets', labelZh: '设计资源', icon: '🎨' },
  { id: 'data', label: 'Datasets', labelZh: '数据集', icon: '📊' },
  { id: 'other', label: 'Other', labelZh: '其他', icon: '📦' },
];

const DELIVERY_TYPES = [
  { id: 'auto', label: 'Auto Delivery', labelZh: '自动交付', desc: 'System delivers file after payment', descZh: '支付确认后系统自动交付文件', icon: FileText },
  { id: 'manual', label: 'Manual Delivery', labelZh: '手动交付', desc: 'You deliver via chat/Telegram', descZh: '您通过聊天/Telegram手动交付', icon: LinkIcon },
];

export default function CreateProductPage() {
  const t = useTranslations('CreateProduct');
  const locale = useLocale();
  const isZh = locale === 'zh';
  const router = useRouter();
  const { isLoggedIn, openAuthModal } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      openAuthModal('login');
    }
  }, [isLoggedIn, openAuthModal]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    tags: '',
    price: '',
    deliveryType: 'auto',
    deliveryContent: '',
    wallet: '',
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/products', {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        tags: formData.tags,
        price_usd: parseFloat(formData.price),
        delivery_type: formData.deliveryType === 'auto' ? 'auto_hosted' : 'manual',
        delivery_content: formData.deliveryContent,
      });
      router.push('/user');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/user" className="text-gray-500 hover:text-gray-900 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Boxes className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">{t('title')}</h1>
            </div>
          </div>
          <Badge variant="outline" className="border-purple-200 text-purple-600 bg-purple-50">
            {t('step')} {step}/3
          </Badge>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-600" />
                {t('step1.title')}
              </CardTitle>
              <CardDescription className="text-gray-500">{t('step1.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700">{t('step1.productTitle')}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder={isZh ? "例如：高级SEO写作AI代理" : "e.g., Advanced SEO Blog Writer Agent"}
                  className="border-gray-200 focus-visible:ring-purple-500"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-gray-700">{t('step1.category')}</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => updateField('category', cat.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${formData.category === cat.id
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-purple-200'
                        }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <p className="text-sm mt-1">{isZh ? cat.labelZh : cat.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700">{t('step1.description_label')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder={isZh ? "描述您的技能功能..." : "Describe what your skill does..."}
                  rows={4}
                  className="border-gray-200 focus-visible:ring-purple-500 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-gray-700">{t('step1.tags')}</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => updateField('tags', e.target.value)}
                  placeholder="SEO, content, marketing"
                  className="border-gray-200 focus-visible:ring-purple-500"
                />
                <p className="text-xs text-gray-400">{t('step1.tags_hint')}</p>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-purple-600 hover:bg-purple-700 rounded-lg h-11"
                disabled={!formData.title || !formData.category}
              >
                {t('next')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Pricing & Delivery */}
        {step === 2 && (
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                {t('step2.title')}
              </CardTitle>
              <CardDescription className="text-gray-500">{t('step2.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-700">{t('step2.price')}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => updateField('price', e.target.value)}
                    placeholder="49"
                    className="pl-8 border-gray-200 focus-visible:ring-purple-500"
                  />
                </div>
                <p className="text-xs text-gray-400">{t('step2.price_hint')}</p>
              </div>

              <div className="space-y-3">
                <Label className="text-gray-700">{t('step2.delivery')}</Label>
                <div className="grid gap-3">
                  {DELIVERY_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => updateField('deliveryType', type.id)}
                      className={`p-4 rounded-xl border text-left transition-all flex items-start gap-4 ${formData.deliveryType === type.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 bg-white hover:border-purple-200'
                        }`}
                    >
                      <div className={`p-2 rounded-lg ${formData.deliveryType === type.id ? 'bg-purple-100' : 'bg-gray-100'}`}>
                        <type.icon className={`w-5 h-5 ${formData.deliveryType === type.id ? 'text-purple-600' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <p className={`font-medium ${formData.deliveryType === type.id ? 'text-purple-700' : 'text-gray-700'}`}>
                          {isZh ? type.labelZh : type.label}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{isZh ? type.descZh : type.desc}</p>
                      </div>
                      {formData.deliveryType === type.id && (
                        <CheckCircle className="w-5 h-5 text-purple-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {formData.deliveryType === 'auto' && (
                <div className="space-y-2">
                  <Label className="text-gray-700">{t('step2.upload')}</Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-purple-300 transition cursor-pointer bg-gray-50 relative">
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setLoading(true);
                        try {
                          const formData = new FormData();
                          formData.append('file', file);
                          const res = await api.post('/upload', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                          });
                          updateField('deliveryContent', res.data.url);
                          // Show success feedback (simplified)
                          alert('File uploaded successfully!');
                        } catch (err) {
                          console.error('Upload failed', err);
                          alert('Upload failed');
                        } finally {
                          setLoading(false);
                        }
                      }}
                    />
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">
                      {formData.deliveryContent ? 'File uploaded! Click to replace.' : t('step2.upload_hint')}
                    </p>
                    {formData.deliveryContent && (
                      <p className="text-xs text-emerald-600 mt-2 flex items-center justify-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Uploaded
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg h-11"
                >
                  {t('back')}
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 rounded-lg h-11"
                  disabled={!formData.price || (formData.deliveryType === 'auto' && !formData.deliveryContent)}
                >
                  {t('next')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Payment Setup */}
        {step === 3 && (
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-purple-600" />
                {t('step3.title')}
              </CardTitle>
              <CardDescription className="text-gray-500">{t('step3.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-3 p-4 bg-purple-50 border border-purple-100 rounded-xl">
                <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <p className="text-sm text-purple-700">{t('step3.info')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet" className="text-gray-700">{t('step3.wallet')}</Label>
                <Input
                  id="wallet"
                  value={formData.wallet}
                  onChange={(e) => updateField('wallet', e.target.value)}
                  placeholder="0x1234...5678 or TRC20/BEP20 address"
                  className="border-gray-200 focus-visible:ring-purple-500 font-mono"
                />
                <p className="text-xs text-gray-400">{t('step3.wallet_hint')}</p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg h-11"
                >
                  {t('back')}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !formData.wallet}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-lg h-11"
                >
                  {loading ? (isZh ? '提交中...' : 'Submitting...') : t('submit')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${s === step ? 'w-8 bg-purple-600' : s < step ? 'w-2 bg-purple-300' : 'w-2 bg-gray-200'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
