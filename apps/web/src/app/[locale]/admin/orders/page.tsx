'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Boxes, Shield, ShoppingBag, Search, Loader2, Filter,
  Calendar, DollarSign, Package, User, ChevronLeft, Eye,
  CheckCircle, XCircle, Clock
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Order {
  id: number;
  amount_usd: number;
  status: string;
  createdAt: string;
  payment_method?: string;
  transaction_id?: string;
  delivery_status?: string;
  product?: { id: number; title: string; delivery_type: string };
  buyer?: { id: number; nickname?: string; email: string };
  seller?: { id: number; nickname?: string; email: string };
}

export default function OrdersManagement() {
  const locale = useLocale();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [authorized, setAuthorized] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = `/${locale}/admin/login`;
      return;
    }

    const fetchData = async () => {
      try {
        const profileRes = await api.get('/auth/profile');
        if (profileRes.data.role !== 'admin') {
          window.location.href = `/${locale}/user`;
          return;
        }
        setAuthorized(true);

        const ordersRes = await api.get('/orders');
        const ordersData = ordersRes.data.items || ordersRes.data || [];
        setOrders(ordersData);
        setFilteredOrders(ordersData);
      } catch (err) {
        console.error('Failed to load orders', err);
        window.location.href = `/${locale}/admin/login`;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toString().includes(searchTerm) ||
        order.product?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.buyer?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.seller?.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const handleRefundOrder = async (orderId: number) => {
    try {
      await api.put(`/orders/${orderId}/refund`);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'refunded' } : o));
    } catch (err) {
      console.error('Failed to refund order', err);
    }
  };

  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + Number(o.amount_usd), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back to Admin
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Boxes className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">MySkillStore</span>
              <Badge className="bg-red-100 text-red-700 border-red-200">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            </div>
          </div>
          <Link href="/user">
            <Button variant="outline" size="sm" className="rounded-lg">
              User Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Completed</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.completed}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Cancelled</p>
                <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-600">${stats.totalRevenue.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border-gray-200 mb-6">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by order ID, product, buyer, or seller..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">All Orders ({filteredOrders.length})</CardTitle>
            <CardDescription className="text-gray-500">View and manage all platform orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders found.</p>
              ) : (
                filteredOrders.map(order => (
                  <div key={order.id} className="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-purple-200 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
                          <Badge variant="outline" className={
                            order.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                              order.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                  order.status === 'refunded' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                    'bg-gray-100 text-gray-700 border-gray-200'
                          }>
                            {order.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {order.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {order.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                            {order.status.replace('_', ' ')}
                          </Badge>
                          <p className="text-2xl font-bold text-gray-900">${Number(order.amount_usd).toFixed(2)}</p>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{order.product?.title || 'N/A'}</span>
                            <Badge variant="outline" className="text-xs">
                              {order.product?.delivery_type}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span>Buyer: {order.buyer?.nickname || order.buyer?.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span>Seller: {order.seller?.nickname || order.seller?.email || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{new Date(order.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </Button>
                        {order.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 border-red-300 text-red-700 hover:bg-red-50"
                            onClick={() => handleRefundOrder(order.id)}
                          >
                            <DollarSign className="w-4 h-4" />
                            Refund
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>Complete order information</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Order ID</p>
                  <p className="text-base font-semibold text-gray-900">#{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                  <Badge variant="outline" className={
                    selectedOrder.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                      selectedOrder.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        'bg-red-100 text-red-700 border-red-200'
                  }>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Amount</p>
                  <p className="text-xl font-bold text-gray-900">${Number(selectedOrder.amount_usd).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Date</p>
                  <p className="text-base text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Product Details</p>
                <p className="text-base font-semibold text-gray-900">{selectedOrder.product?.title}</p>
                <p className="text-sm text-gray-600 mt-1">Delivery: {selectedOrder.product?.delivery_type}</p>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Buyer Information</p>
                <p className="text-base text-gray-900">{selectedOrder.buyer?.nickname || 'No nickname'}</p>
                <p className="text-sm text-gray-600">{selectedOrder.buyer?.email}</p>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Seller Information</p>
                <p className="text-base text-gray-900">{selectedOrder.seller?.nickname || 'No nickname'}</p>
                <p className="text-sm text-gray-600">{selectedOrder.seller?.email}</p>
              </div>
              {selectedOrder.transaction_id && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Transaction ID</p>
                  <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">{selectedOrder.transaction_id}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
