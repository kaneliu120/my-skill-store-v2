'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Boxes, Shield, CheckCircle, XCircle, Clock, Package,
  Users, ShoppingBag, Loader2
} from 'lucide-react';

interface Product {
  id: number;
  title: string;
  description?: string;
  category?: string;
  price_usd: number;
  delivery_type: string;
  status: string;
  createdAt: string;
  seller?: { id: number; nickname?: string; email: string };
}

interface Order {
  id: number;
  amount_usd: number;
  status: string;
  createdAt: string;
  product?: { id: number; title: string };
  buyer?: { id: number; nickname?: string; email: string };
  seller?: { id: number; nickname?: string; email: string };
}

interface User {
  id: number;
  email: string;
  nickname?: string;
  role: string;
  created_at: string;
}

export default function AdminDashboard() {
  const locale = useLocale();
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectReasons, setRejectReasons] = useState<Record<number, string>>({});
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = `/${locale}/login`;
      return;
    }

    const fetchData = async () => {
      try {
        // Verify admin access
        const profileRes = await api.get('/auth/profile');
        if (profileRes.data.role !== 'admin') {
          window.location.href = `/${locale}/user`;
          return;
        }
        setAuthorized(true);

        const [pendingRes, productsRes, ordersRes, usersRes] = await Promise.allSettled([
          api.get('/products/admin/pending'),
          api.get('/products'),
          api.get('/orders'),
          api.get('/users'),
        ]);

        if (pendingRes.status === 'fulfilled') setPendingProducts(pendingRes.value.data);
        if (productsRes.status === 'fulfilled') setAllProducts(productsRes.value.data);
        if (ordersRes.status === 'fulfilled') setAllOrders(ordersRes.value.data);
        if (usersRes.status === 'fulfilled') setAllUsers(usersRes.value.data);
      } catch (err) {
        console.error('Admin data load failed', err);
        window.location.href = `/${locale}/login`;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  const handleApprove = async (productId: number) => {
    try {
      await api.put(`/products/admin/${productId}/approve`);
      setPendingProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error('Approve failed', err);
    }
  };

  const handleReject = async (productId: number) => {
    const reason = rejectReasons[productId] || 'Does not meet guidelines';
    try {
      await api.put(`/products/admin/${productId}/reject`, { reason });
      setPendingProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error('Reject failed', err);
    }
  };

  if (loading || !authorized) {
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
            <Badge className="bg-red-100 text-red-700 border-red-200 ml-2">
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          </div>
          <Link href={`/${locale}/user`}>
            <Button variant="outline" size="sm" className="rounded-lg">
              User Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Review</p>
                  <p className="text-2xl font-bold text-amber-600">{pendingProducts.length}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{allProducts.length}</p>
                </div>
                <Package className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{allOrders.length}</p>
                </div>
                <ShoppingBag className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{allUsers.length}</p>
                </div>
                <Users className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-xl">
            <TabsTrigger value="pending" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg gap-2">
              <Clock className="w-4 h-4" />
              Pending Review ({pendingProducts.length})
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg gap-2">
              <Package className="w-4 h-4" />
              All Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg gap-2">
              <ShoppingBag className="w-4 h-4" />
              All Orders
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Pending Review Tab */}
          <TabsContent value="pending">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Products Pending Review</CardTitle>
                <CardDescription className="text-gray-500">Review and approve or reject submitted products</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingProducts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No products pending review.</p>
                ) : (
                  <div className="space-y-6">
                    {pendingProducts.map(product => (
                      <div key={product.id} className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{product.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              By: {product.seller?.nickname || product.seller?.email || 'Unknown'} ·
                              Category: {product.category || 'N/A'} ·
                              Delivery: {product.delivery_type}
                            </p>
                          </div>
                          <p className="text-xl font-bold text-gray-900">${Number(product.price_usd).toFixed(2)}</p>
                        </div>
                        {product.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
                        )}
                        <div className="flex items-end gap-4">
                          <div className="flex-1">
                            <Textarea
                              placeholder="Rejection reason (optional)"
                              className="text-sm"
                              value={rejectReasons[product.id] || ''}
                              onChange={(e) => setRejectReasons(prev => ({ ...prev, [product.id]: e.target.value }))}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-lg"
                              onClick={() => handleApprove(product.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              className="border-red-300 text-red-700 hover:bg-red-50 gap-2 rounded-lg"
                              onClick={() => handleReject(product.id)}
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Products Tab */}
          <TabsContent value="products">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">All Products</CardTitle>
                <CardDescription className="text-gray-500">Overview of all products on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allProducts.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-gray-900">{product.title}</h4>
                          <Badge variant="outline" className={
                            product.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                            product.status === 'pending_review' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                            product.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                          }>
                            {product.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Seller: {product.seller?.nickname || product.seller?.email || 'N/A'} · {new Date(product.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900">${Number(product.price_usd).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">All Orders</CardTitle>
                <CardDescription className="text-gray-500">Platform-wide order history</CardDescription>
              </CardHeader>
              <CardContent>
                {allOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No orders yet.</p>
                ) : (
                  <div className="space-y-3">
                    {allOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium text-gray-900">#{order.id} - {order.product?.title || 'N/A'}</h4>
                            <Badge variant="outline" className={
                              order.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                              'bg-amber-100 text-amber-700 border-amber-200'
                            }>
                              {order.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Buyer: {order.buyer?.nickname || order.buyer?.email || 'N/A'} ·
                            Seller: {order.seller?.nickname || order.seller?.email || 'N/A'} ·
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="font-bold text-gray-900">${Number(order.amount_usd).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Users</CardTitle>
                <CardDescription className="text-gray-500">All registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-gray-900">{user.nickname || user.email}</h4>
                          <Badge variant="outline" className={
                            user.role === 'admin' ? 'bg-red-100 text-red-700 border-red-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                          }>
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {user.email} · Joined: {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
