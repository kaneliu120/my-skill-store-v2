'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Package, ShoppingBag, Wallet, Settings, Plus, Boxes,
  TrendingUp, Clock, CheckCircle, XCircle, Loader2
} from 'lucide-react';

interface User {
  id: number;
  email: string;
  nickname?: string;
  avatar_url?: string;
  crypto_wallet_address?: string;
  role: string;
}

interface Product {
  id: number;
  title: string;
  price_usd: number;
  status: string;
  createdAt: string;
}

interface Order {
  id: number;
  amount_usd: number;
  status: string;
  createdAt: string;
  transaction_hash?: string;
  product?: { id: number; title: string };
  seller?: { id: number; nickname?: string; email: string };
  buyer?: { id: number; nickname?: string; email: string };
}

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { color: string; icon: React.ReactNode }> = {
    completed: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle className="w-3 h-3" /> },
    approved: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle className="w-3 h-3" /> },
    confirmed: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <CheckCircle className="w-3 h-3" /> },
    pending_review: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock className="w-3 h-3" /> },
    created: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock className="w-3 h-3" /> },
    paid_reported: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Clock className="w-3 h-3" /> },
    draft: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: <Clock className="w-3 h-3" /> },
    rejected: { color: 'bg-red-100 text-red-700 border-red-200', icon: <XCircle className="w-3 h-3" /> },
    cancelled: { color: 'bg-red-100 text-red-700 border-red-200', icon: <XCircle className="w-3 h-3" /> },
    off_shelf: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: <XCircle className="w-3 h-3" /> },
  };
  const { color, icon } = config[status] || config.draft;

  return (
    <Badge variant="outline" className={`${color} gap-1`}>
      {icon}
      {status.replace('_', ' ')}
    </Badge>
  );
};

export default function UserDashboard() {
  const t = useTranslations('Dashboard');
  const locale = useLocale();

  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Order[]>([]);
  const [sales, setSales] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingWallet, setIsEditingWallet] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = `/${locale}/login`;
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, productsRes, purchasesRes, salesRes] = await Promise.allSettled([
          api.get('/auth/profile'),
          api.get('/products/my/list'),
          api.get('/orders/my/purchases'),
          api.get('/orders/my/sales'),
        ]);

        if (profileRes.status === 'fulfilled') {
          setUser(profileRes.value.data);
          setWalletAddress(profileRes.value.data.crypto_wallet_address || '');
        }
        if (productsRes.status === 'fulfilled') setProducts(productsRes.value.data);
        if (purchasesRes.status === 'fulfilled') setPurchases(purchasesRes.value.data);
        if (salesRes.status === 'fulfilled') setSales(salesRes.value.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  const handleUpdateWallet = async () => {
    if (!user) return;
    try {
      await api.put(`/users/${user.id}`, { crypto_wallet_address: walletAddress });
      setUser(prev => prev ? { ...prev, crypto_wallet_address: walletAddress } : null);
      setIsEditingWallet(false);
    } catch (err) {
      console.error('Failed to update wallet', err);
      alert('Failed to update wallet');
    }
  };

  const totalSalesAmount = sales
    .filter(s => s.status === 'completed')
    .reduce((sum, s) => sum + Number(s.amount_usd), 0);
  const totalPurchases = purchases.length;
  const totalSalesCount = sales.filter(s => s.status === 'completed').length;

  const displayName = user?.nickname || user?.email?.split('@')[0] || 'User';
  const walletDisplay = user?.crypto_wallet_address
    ? `${user.crypto_wallet_address.slice(0, 6)}...${user.crypto_wallet_address.slice(-4)}`
    : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <Link href="/" className="text-lg font-bold text-gray-900">
              MySkillStore
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/products/create">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white gap-2 rounded-lg">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav.newProduct')}</span>
              </Button>
            </Link>
            <Avatar className="h-9 w-9 border-2 border-purple-100">
              <AvatarImage src={user?.avatar_url || ''} />
              <AvatarFallback className="bg-purple-100 text-purple-600">{displayName[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* User Profile Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-purple-100">
              <AvatarImage src={user?.avatar_url || ''} />
              <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">{displayName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            {isEditingWallet ? (
              <div className="flex items-center gap-2">
                <input
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter wallet address"
                  className="h-9 px-3 rounded-lg border border-gray-300 text-sm w-64"
                />
                <Button size="sm" onClick={handleUpdateWallet} className="bg-purple-600 hover:bg-purple-700 text-white h-9">
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditingWallet(false)} className="h-9">
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                {walletDisplay && (
                  <div className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 flex items-center gap-2 bg-white">
                    <Wallet className="w-4 h-4" />
                    {walletDisplay}
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg gap-2"
                  onClick={() => setIsEditingWallet(true)}
                >
                  <Settings className="w-4 h-4" />
                  {t('settings.wallet')}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{t('stats.balance')}</p>
                  <p className="text-2xl font-bold text-gray-900">${totalSalesAmount.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Wallet className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{t('stats.totalSales')}</p>
                  <p className="text-2xl font-bold text-gray-900">{totalSalesCount}</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{t('stats.purchases')}</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPurchases}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-xl w-full h-auto flex flex-wrap justify-start">
            <TabsTrigger value="products" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg gap-2 flex-1 sm:flex-none">
              <Package className="w-4 h-4" />
              {t('tabs.myProducts')}
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg gap-2 flex-1 sm:flex-none">
              <ShoppingBag className="w-4 h-4" />
              {t('tabs.myOrders')}
            </TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg gap-2 flex-1 sm:flex-none">
              <TrendingUp className="w-4 h-4" />
              {t('tabs.mySales')}
            </TabsTrigger>
          </TabsList>

          {/* My Products Tab */}
          <TabsContent value="products">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900">{t('products.title')}</CardTitle>
                    <CardDescription className="text-gray-500">{t('products.description')}</CardDescription>
                  </div>
                  <Link href="/products/create">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 gap-2 rounded-lg">
                      <Plus className="w-4 h-4" />
                      {t('products.add')}
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No products yet. Create your first product!</p>
                ) : (
                  <div className="space-y-4">
                    {products.map(product => (
                      <div key={product.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium text-gray-900">{product.title}</h4>
                            <StatusBadge status={product.status} />
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {t('products.created')}: {new Date(product.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center justify-between sm:block sm:text-right">
                          <p className="font-bold text-gray-900">${Number(product.price_usd).toFixed(2)}</p>
                          <Link href={`/products/${product.id}`}>
                            <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 mt-1 p-0 sm:p-2">
                              {t('products.view')}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">{t('orders.title')}</CardTitle>
                <CardDescription className="text-gray-500">{t('orders.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                {purchases.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No orders yet.</p>
                ) : (
                  <div className="space-y-4">
                    {purchases.map(order => (
                      <Link key={order.id} href={`/${locale}/orders/${order.id}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-purple-200 transition gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h4 className="font-medium text-gray-900">{order.product?.title || `Order #${order.id}`}</h4>
                              <StatusBadge status={order.status} />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {t('orders.seller')}: {order.seller?.nickname || order.seller?.email || 'N/A'} · {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right sm:text-right">
                            <p className="font-bold text-gray-900">${Number(order.amount_usd).toFixed(2)}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Sales Tab */}
          <TabsContent value="sales">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">{t('sales.title')}</CardTitle>
                <CardDescription className="text-gray-500">{t('sales.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                {sales.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No sales yet.</p>
                ) : (
                  <div className="space-y-4">
                    {sales.map(sale => (
                      <div key={sale.id} className="relative block group">
                        <Link href={`/${locale}/orders/${sale.id}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-purple-200 transition cursor-pointer gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h4 className="font-medium text-gray-900">{sale.product?.title || `Order #${sale.id}`}</h4>
                                <StatusBadge status={sale.status} />
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {t('sales.buyer')}: {sale.buyer?.nickname || sale.buyer?.email || 'N/A'} · {new Date(sale.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right sm:text-right">
                              <p className="font-bold text-emerald-600">+${Number(sale.amount_usd).toFixed(2)}</p>
                            </div>
                          </div>
                        </Link>
                        {sale.status === 'paid_reported' && (
                          <div className="absolute right-4 bottom-4">
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs z-10 relative"
                              onClick={async (e) => {
                                e.preventDefault(); // Prevent navigation
                                try {
                                  await api.put(`/orders/${sale.id}/confirm`);
                                  setSales(prev => prev.map(s => s.id === sale.id ? { ...s, status: 'confirmed' } : s));
                                } catch (err) {
                                  console.error('Failed to confirm', err);
                                }
                              }}
                            >
                              Confirm Payment
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
