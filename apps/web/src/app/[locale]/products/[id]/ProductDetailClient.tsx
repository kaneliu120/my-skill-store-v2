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
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/products" className="text-gray-500 hover:text-gray-900 transition">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                <Boxes className="w-5 h-5 text-white" />
                            </div>
                            <Link href="/" className="text-lg font-bold text-gray-900">
                                MySkillStore
                            </Link>
                        </div>
                    </div>
                    <Link href="/user">
                        <Button size="sm" variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg">
                            {t('nav.dashboard')}
                        </Button>
                    </Link>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-8 max-w-6xl">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Preview Image */}
                        <div className="aspect-video bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-gray-200 flex items-center justify-center overflow-hidden relative">
                            {product.preview_image_url ? (
                                <img src={product.preview_image_url} alt={product.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <Brain className="w-20 h-20 text-purple-300 mx-auto mb-2" />
                                    <p className="text-gray-400">{isZh ? '预览图片' : 'Preview Image'}</p>
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                                    {product.category || 'Uncategorized'}
                                </Badge>
                                {product.tags && product.tags.split(',').map((tag: string) => (
                                    <Badge key={tag} variant="outline" className="border-gray-200 text-gray-600">
                                        {tag.trim()}
                                    </Badge>
                                ))}
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

                            <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{new Date(product.created_at || product.createdAt || Date.now()).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <Card className="bg-white border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-gray-900 text-lg">{t('description')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="whitespace-pre-wrap text-gray-600 leading-relaxed">
                                    {product.description}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery Info */}
                        <Card className="bg-white border-gray-200">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        {product.delivery_type === 'auto_hosted' ? (
                                            <Download className="w-5 h-5 text-emerald-600" />
                                        ) : (
                                            <MessageCircle className="w-5 h-5 text-emerald-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {product.delivery_type === 'auto_hosted' ? t('delivery.auto') : t('delivery.manual')}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {product.delivery_type === 'auto_hosted' ? t('delivery.autoDesc') : t('delivery.manualDesc')}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Price Card */}
                        <Card className="bg-white border-gray-200 sticky top-24">
                            <CardContent className="pt-6 space-y-6">
                                {/* Price */}
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-gray-900">${Number(product.price_usd).toFixed(2)}</p>
                                    <p className="text-sm text-gray-500 mt-1">{t('oneTime')}</p>
                                </div>

                                {/* Buy Button */}
                                <Button
                                    onClick={handleBuy}
                                    disabled={buying}
                                    className="w-full h-12 text-lg bg-purple-600 hover:bg-purple-700 gap-2 rounded-xl"
                                >
                                    {buying ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <ShoppingCart className="w-5 h-5" />
                                    )}
                                    {t('buyNow')}
                                </Button>

                                {/* Trust Badges */}
                                <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Shield className="w-4 h-4" />
                                        {t('trust.secure')}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Wallet className="w-4 h-4" />
                                        {t('trust.direct')}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Seller Card */}
                        <Card className="bg-white border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-gray-900 text-base">{t('seller.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 border-2 border-purple-100">
                                        <AvatarImage src={product.seller?.avatar_url} />
                                        <AvatarFallback className="bg-purple-100 text-purple-600">
                                            {product.seller?.nickname?.[0] || product.seller?.email?.[0] || 'S'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-gray-900">{product.seller?.nickname || product.seller?.email}</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 gap-2 rounded-lg">
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
