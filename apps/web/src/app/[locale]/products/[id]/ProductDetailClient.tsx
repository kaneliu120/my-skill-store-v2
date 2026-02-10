'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    ArrowLeft, ShoppingCart, Shield, Clock, Download, MessageCircle, Brain,
    Wallet, Loader2, Boxes
} from 'lucide-react';
import { trackEvent } from '@/lib/tracking';
import { useAuth } from '@/components/auth/AuthContext';

interface Product {
    id: string | number;
    title: string;
    price_usd: number;
    description: string;
    preview_image_url?: string;
    category?: string;
    tags?: string;
    createdAt?: string;
    created_at?: string; // Handle both cases from API
    delivery_type?: string;
    seller?: {
        nickname?: string;
        email?: string;
        avatar_url?: string;
        crypto_wallet_address?: string;
    };
}

export default function ProductDetailClient({ product, locale }: { product: Product, locale: string }) {
    const t = useTranslations('ProductDetail');
    const isZh = locale === 'zh';
    const router = useRouter();

    // product is passed as prop
    const { isLoggedIn, openAuthModal } = useAuth();
    const [buying, setBuying] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleBuy = async () => {
        if (!product) return;
        if (!isLoggedIn) {
            openAuthModal('login');
            return;
        }

        trackEvent({
            event_name: 'click_buy_now',
            element_id: 'buy_now_btn',
            metadata: { product_id: product.id, product_title: product.title, price: product.price_usd }
        });

        setBuying(true);
        try {
            const res = await api.post('/orders', { product_id: Number(product.id) });
            router.push(`/${locale}/orders/${res.data.id}`);
        } catch (err) {
            console.error('Failed to create order', err);
            alert('Failed to create order');
            setBuying(false);
        }
    };

    const copyWallet = () => {
        if (!product?.seller?.crypto_wallet_address) return;
        navigator.clipboard.writeText(product.seller.crypto_wallet_address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Product not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/products" className="group text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium hidden sm:inline">{isZh ? '返回列表' : 'Back'}</span>
                        </Link>
                        <div className="h-4 w-[1px] bg-gray-200 mx-2 hidden sm:block" />
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-600/20">
                                <Boxes className="w-5 h-5 text-white" />
                            </div>
                            <Link href="/" className="text-lg font-bold text-gray-900 hover:text-purple-600 transition-colors">
                                MySkillStore
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/user" className="hidden sm:block">
                            <Button size="sm" variant="ghost" className="text-gray-600 hover:bg-gray-100 rounded-lg">
                                {t('nav.dashboard')}
                            </Button>
                        </Link>
                        {!isLoggedIn && (
                            <Button size="sm" onClick={() => openAuthModal('login')} className="bg-purple-600 hover:bg-purple-700 rounded-lg">
                                {isZh ? '登录' : 'Login'}
                            </Button>
                        )}
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-8 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Preview Image */}
                        <div className="aspect-video bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-gray-200 flex items-center justify-center overflow-hidden relative group">
                            {product.preview_image_url ? (
                                <img
                                    src={product.preview_image_url}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="text-center group-hover:scale-110 transition-transform duration-500">
                                    <Brain className="w-20 h-20 text-purple-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-medium">{isZh ? '预览图片' : 'Preview Image'}</p>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                        </div>

                        {/* Product Header Info */}
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Badge className="bg-purple-100 text-purple-700 border-purple-200 px-3 py-1">
                                    {product.category || 'Skill'}
                                </Badge>
                                {product.tags && product.tags.split(',').map((tag: string) => (
                                    <Badge key={tag} variant="outline" className="border-gray-200 text-gray-500 bg-white">
                                        #{tag.trim()}
                                    </Badge>
                                ))}
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-purple-400" />
                                    <span>{isZh ? '发布于 ' : 'Published '} {new Date(product.created_at || product.createdAt || Date.now()).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-emerald-400" />
                                    <span className="text-emerald-600 font-medium">{isZh ? '经审核' : 'Verified'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <Card className="bg-white border-gray-200 border-none shadow-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-8 py-6">
                                <CardTitle className="text-gray-900 text-xl flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5 text-purple-500" />
                                    {t('description')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-8 py-8">
                                <div className="whitespace-pre-wrap text-gray-600 leading-relaxed text-lg">
                                    {product.description}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card className="bg-white border-gray-100 shadow-sm rounded-2xl p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        {product.delivery_type === 'auto_hosted' ? (
                                            <Download className="w-6 h-6 text-emerald-600" />
                                        ) : (
                                            <MessageCircle className="w-6 h-6 text-emerald-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">
                                            {product.delivery_type === 'auto_hosted' ? t('delivery.auto') : t('delivery.manual')}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {product.delivery_type === 'auto_hosted' ? t('delivery.autoDesc') : t('delivery.manualDesc')}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="bg-white border-gray-100 shadow-sm rounded-2xl p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{isZh ? '安全保障' : 'Secure'}</p>
                                        <p className="text-sm text-gray-500 mt-0.5">{isZh ? '直接向卖家付款，无中间商' : 'Direct payment to seller'}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                        {/* Price Card */}
                        <Card className="bg-white border-none shadow-xl rounded-3xl overflow-hidden md:sticky md:top-24 ring-1 ring-gray-100">
                            <CardContent className="p-8 space-y-8">
                                {/* Price */}
                                <div className="text-center space-y-2">
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-2xl font-bold text-gray-400">$</span>
                                        <span className="text-6xl font-black text-gray-900 tracking-tighter">
                                            {Number(product.price_usd).toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">{t('oneTime')}</p>
                                </div>

                                {/* Buy Button */}
                                <Button
                                    onClick={handleBuy}
                                    disabled={buying}
                                    className="w-full h-16 text-xl bg-purple-600 hover:bg-purple-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-purple-600/20 gap-3 rounded-2xl font-bold"
                                >
                                    {buying ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <ShoppingCart className="w-6 h-6" />
                                    )}
                                    {t('buyNow')}
                                </Button>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                                    <div className="flex flex-col items-center gap-1 text-center">
                                        <Shield className="w-5 h-5 text-emerald-500" />
                                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{t('trust.secure')}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 text-center">
                                        <Wallet className="w-5 h-5 text-blue-500" />
                                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider text-nowrap">{t('trust.direct')}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Seller Card */}
                        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden ring-1 ring-gray-100">
                            <CardHeader className="bg-gray-50/50 pb-4">
                                <CardTitle className="text-gray-500 text-xs font-bold uppercase tracking-widest">{t('seller.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 px-6 pb-6 space-y-6">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-14 w-14 ring-4 ring-purple-50">
                                        <AvatarImage src={product.seller?.avatar_url} />
                                        <AvatarFallback className="bg-purple-600 text-white text-xl font-bold">
                                            {product.seller?.nickname?.[0] || product.seller?.email?.[0] || 'S'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg leading-none mb-1">
                                            {product.seller?.nickname || product.seller?.email?.split('@')[0]}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {isZh ? '注册于 ' : 'Member since '} {new Date(product.createdAt || Date.now()).getFullYear()}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full h-11 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-purple-200 hover:text-purple-600 transition-all gap-2 rounded-xl font-medium">
                                    <MessageCircle className="w-4 h-4" />
                                    {t('seller.contact')}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
