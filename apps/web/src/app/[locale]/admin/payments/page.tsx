'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Boxes, Shield, DollarSign, Search, Loader2, Filter,
  Calendar, CreditCard, User, ChevronLeft, Eye,
  CheckCircle, XCircle, AlertTriangle, TrendingUp, Wallet
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

interface Payment {
  id: number;
  order_id: number;
  amount_usd: number;
  payment_method: string;
  status: string;
  transaction_id?: string;
  wallet_address?: string;
  createdAt: string;
  confirmedAt?: string;
  order?: {
    id: number;
    product?: { title: string };
    buyer?: { nickname?: string; email: string };
    seller?: { nickname?: string; email: string };
  };
}

export default function PaymentsManagement() {
  const locale = useLocale();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [authorized, setAuthorized] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
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

        const paymentsRes = await api.get('/payments');
        const paymentsData = paymentsRes.data.items || paymentsRes.data || [];
        setPayments(paymentsData);
        setFilteredPayments(paymentsData);
      } catch (err) {
        console.error('Failed to load payments', err);
        window.location.href = `/${locale}/admin/login`;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  useEffect(() => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.id.toString().includes(searchTerm) ||
        payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.order?.buyer?.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    if (methodFilter !== 'all') {
      filtered = filtered.filter(payment => payment.payment_method === methodFilter);
    }

    setFilteredPayments(filtered);
  }, [searchTerm, statusFilter, methodFilter, payments]);

  const handleVerifyPayment = async (paymentId: number) => {
    try {
      await api.put(`/payments/${paymentId}/verify`);
      setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'verified' } : p));
    } catch (err) {
      console.error('Failed to verify payment', err);
    }
  };

  const handleMarkAsFailed = async (paymentId: number) => {
    try {
      await api.put(`/payments/${paymentId}/fail`);
      setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'failed' } : p));
    } catch (err) {
      console.error('Failed to mark payment as failed', err);
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
    total: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    verified: payments.filter(p => p.status === 'verified').length,
    failed: payments.filter(p => p.status === 'failed').length,
    totalAmount: payments
      .filter(p => p.status === 'verified')
      .reduce((sum, p) => sum + Number(p.amount_usd), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/admin`}>
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
          <Link href={`/${locale}/user`}>
            <Button variant="outline" size="sm" className="rounded-lg">
              User Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Total Payments</p>
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
                <p className="text-sm text-gray-500 mb-1">Verified</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.verified}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Failed</p>
                <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-600 to-blue-600 border-0">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-purple-100 mb-1 flex items-center justify-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-white">${stats.totalAmount.toFixed(2)}</p>
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
                  placeholder="Search by payment ID, transaction ID, or buyer..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">All Payments ({filteredPayments.length})</CardTitle>
            <CardDescription className="text-gray-500">Monitor and verify payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredPayments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No payments found.</p>
              ) : (
                filteredPayments.map(payment => (
                  <div key={payment.id} className="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-purple-200 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="font-semibold text-gray-900">Payment #{payment.id}</h4>
                          <Badge variant="outline" className={
                            payment.status === 'verified' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                              payment.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                payment.status === 'failed' ? 'bg-red-100 text-red-700 border-red-200' :
                                  'bg-purple-100 text-purple-700 border-purple-200'
                          }>
                            {payment.status === 'verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {payment.status === 'pending' && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {payment.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                            {payment.status}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <Wallet className="w-3 h-3 mr-1" />
                            {payment.payment_method}
                          </Badge>
                          <p className="text-2xl font-bold text-gray-900">${Number(payment.amount_usd).toFixed(2)}</p>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span>Order #{payment.order_id} - {payment.order?.product?.title || 'N/A'}</span>
                          </div>
                          {payment.transaction_id && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">TX:</span>
                              <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{payment.transaction_id}</span>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span>Buyer: {payment.order?.buyer?.nickname || payment.order?.buyer?.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>{new Date(payment.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </Button>
                        {payment.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => handleVerifyPayment(payment.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                              Verify
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 border-red-300 text-red-700 hover:bg-red-50"
                              onClick={() => handleMarkAsFailed(payment.id)}
                            >
                              <XCircle className="w-4 h-4" />
                              Fail
                            </Button>
                          </>
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

      {/* Payment Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details - #{selectedPayment?.id}</DialogTitle>
            <DialogDescription>Complete payment transaction information</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Payment ID</p>
                  <p className="text-base font-semibold text-gray-900">#{selectedPayment.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                  <Badge variant="outline" className={
                    selectedPayment.status === 'verified' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                      selectedPayment.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        'bg-red-100 text-red-700 border-red-200'
                  }>
                    {selectedPayment.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Amount</p>
                  <p className="text-2xl font-bold text-gray-900">${Number(selectedPayment.amount_usd).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Payment Method</p>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {selectedPayment.payment_method}
                  </Badge>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Order Information</p>
                <p className="text-base text-gray-900">Order #{selectedPayment.order_id}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedPayment.order?.product?.title}</p>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Buyer Information</p>
                <p className="text-base text-gray-900">{selectedPayment.order?.buyer?.nickname || 'No nickname'}</p>
                <p className="text-sm text-gray-600">{selectedPayment.order?.buyer?.email}</p>
              </div>
              {selectedPayment.transaction_id && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Transaction ID</p>
                  <p className="text-sm text-gray-900 font-mono bg-gray-100 p-3 rounded break-all">{selectedPayment.transaction_id}</p>
                </div>
              )}
              {selectedPayment.wallet_address && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Wallet Address</p>
                  <p className="text-sm text-gray-900 font-mono bg-gray-100 p-3 rounded break-all">{selectedPayment.wallet_address}</p>
                </div>
              )}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Created At</p>
                    <p className="text-sm text-gray-900">{new Date(selectedPayment.createdAt).toLocaleString()}</p>
                  </div>
                  {selectedPayment.confirmedAt && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Confirmed At</p>
                      <p className="text-sm text-gray-900">{new Date(selectedPayment.confirmedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
