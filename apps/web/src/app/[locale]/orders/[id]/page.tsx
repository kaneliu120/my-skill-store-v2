'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft, Clock, CheckCircle, XCircle, Download,
    MessageCircle, Loader2, Copy, Check, Wallet, QrCode
} from 'lucide-react';

interface Order {
    id: number;
    amount_usd: number;
    status: string;
    createdAt: string;
    product: {
        id: number;
        title: string;
        delivery_type: string;
        delivery_content?: string;
    };
    seller: {
        id: number;
        nickname?: string;
        email: string;
        crypto_wallet_address?: string;
    };
    buyer: {
        id: number;
        nickname?: string;
        email: string;
    };
    transaction_hash?: string;
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    const t = useTranslations('OrderDetail'); // You might need to add this to messages
    const locale = useLocale();
    const router = useRouter();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [deliveryContent, setDeliveryContent] = useState<string | null>(null);
    const [txHash, setTxHash] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [orderRes, userRes] = await Promise.all([
                    api.get(`/orders/${params.id}`),
                    api.get('/auth/profile')
                ]);
                setOrder(orderRes.data);
                setCurrentUser(userRes.data);

                // If completed and auto-delivery, fetch content
                if (orderRes.data.status === 'completed' && orderRes.data.product.delivery_type === 'auto_hosted') {
                    try {
                        const deliveryRes = await api.get(`/orders/${params.id}/delivery`);
                        setDeliveryContent(deliveryRes.data); // Assuming API returns the URL string directly or object
                    } catch (e) {
                        console.error('Failed to fetch delivery', e);
                    }
                }
            } catch (err) {
                console.error('Failed to load order', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id]);

    const handlePaymentReport = async () => {
        if (!txHash) return;
        setSubmitting(true);
        try {
            await api.put(`/orders/${params.id}/pay`, { transaction_hash: txHash });
            setOrder(prev => prev ? { ...prev, status: 'paid_reported' } : null);
        } catch (err) {
            console.error('Failed to report payment', err);
            alert('Failed to report payment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmPayment = async () => {
        setSubmitting(true);
        try {
            await api.put(`/orders/${params.id}/confirm`);
            setOrder(prev => prev ? { ...prev, status: 'confirmed' } : null);
        } catch (err) {
            console.error('Failed to confirm payment', err);
            alert('Failed to confirm payment');
        } finally {
            setSubmitting(false);
        }
    };

    // Auto-complete order if confirmed (simulated for now, ideally backend does this)
    useEffect(() => {
        if (order?.status === 'confirmed') {
            // Trigger complete immediately for now to show delivery
            api.put(`/orders/${order.id}/complete`)
                .then(() => {
                    setOrder(prev => prev ? { ...prev, status: 'completed' } : null);
                    if (order.product.delivery_type === 'auto_hosted') {
                        return api.get(`/orders/${order.id}/delivery`);
                    }
                })
                .then(res => {
                    if (res) setDeliveryContent(res.data);
                })
                .catch(err => console.error(err));
        }
    }, [order?.status]);


    const copyWallet = () => {
        if (!order?.seller?.crypto_wallet_address) return;
        navigator.clipboard.writeText(order.seller.crypto_wallet_address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!order) return <div className="p-8 text-center">Order not found</div>;

    const isBuyer = currentUser?.id === order.buyer.id;
    const isSeller = currentUser?.id === order.seller.id;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/user" className="text-gray-500 hover:text-gray-900 transition">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-lg font-bold text-gray-900">Order #{order.id}</h1>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-8 max-w-3xl">
                {/* Status Card */}
                <Card className="bg-white border-gray-200 mb-6">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <CardTitle>Order Status</CardTitle>
                            <Badge className={`text-sm px-3 py-1 ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                    'bg-amber-100 text-amber-700'
                                }`}>
                                {order.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Product</p>
                                <p className="font-medium text-gray-900">{order.product.title}</p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="text-sm text-gray-500">Amount</p>
                                <p className="text-xl font-bold text-gray-900">${Number(order.amount_usd).toFixed(2)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Section (For Buyer) */}
                {isBuyer && order.status === 'created' && (
                    <Card className="bg-white border-gray-200 mb-6">
                        <CardHeader>
                            <CardTitle>Payment Required</CardTitle>
                            <CardDescription>Please send exactly ${order.amount_usd} to the seller's wallet.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-gray-700">Seller's Wallet Address</Label>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 bg-gray-100 px-3 py-3 rounded-lg text-sm font-mono text-gray-700 break-all">
                                        {order.seller.crypto_wallet_address || 'No wallet address provided by seller'}
                                    </code>
                                    <Button variant="outline" onClick={copyWallet} className="shrink-0 h-10 w-10 p-0">
                                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                                {!order.seller.crypto_wallet_address && (
                                    <p className="text-red-500 text-sm">Warning: Seller has not set up a wallet address yet. Do not pay.</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Transaction Hash (TXID)</Label>
                                <Input
                                    placeholder="Enter the transaction hash after payment..."
                                    value={txHash}
                                    onChange={(e) => setTxHash(e.target.value)}
                                />
                            </div>

                            <Button
                                onClick={handlePaymentReport}
                                disabled={submitting || !txHash || !order.seller.crypto_wallet_address}
                                className="w-full bg-purple-600 hover:bg-purple-700"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                I Have Paid
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Confirmation Section (For Seller) */}
                {isSeller && order.status === 'paid_reported' && (
                    <Card className="bg-white border-gray-200 mb-6">
                        <CardHeader>
                            <CardTitle>Payment Reported</CardTitle>
                            <CardDescription>Buyer claims to have paid. Please verify.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm break-all">
                                <strong>TXID:</strong> {order.transaction_hash || 'Not provided'}
                            </div>
                            <Button
                                onClick={handleConfirmPayment}
                                disabled={submitting}
                                className="w-full bg-emerald-600 hover:bg-emerald-700"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Confirm Payment Received
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Delivery Section */}
                {order.status === 'completed' && (
                    <Card className="bg-white border-gray-200 mb-6">
                        <CardHeader>
                            <CardTitle className="text-emerald-700 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Order Completed
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {order.product.delivery_type === 'auto_hosted' ? (
                                <div className="text-center py-6">
                                    <Download className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your File is Ready</h3>
                                    {deliveryContent ? (
                                        <a href={deliveryContent} target="_blank" rel="noopener noreferrer">
                                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                                                <Download className="w-4 h-4" />
                                                Download Now
                                            </Button>
                                        </a>
                                    ) : (
                                        <p className="text-gray-500">Loading download link...</p>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Manual Delivery</h3>
                                    <p className="text-gray-500 mb-4">Please contact the seller to receive your item.</p>
                                    <div className="p-4 bg-gray-50 rounded-lg inline-block text-left">
                                        <p className="text-sm"><strong>Seller:</strong> {order.seller.nickname || order.seller.email}</p>
                                        <p className="text-sm"><strong>Email:</strong> {order.seller.email}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Waiting States */}
                {order.status === 'paid_reported' && isBuyer && (
                    <div className="p-6 bg-blue-50 text-blue-700 rounded-xl text-center">
                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="font-medium">Waiting for Seller Confirmation</p>
                        <p className="text-sm opacity-80 mt-1">The seller has been notified to verify your payment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
