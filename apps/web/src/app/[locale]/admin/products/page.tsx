'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Boxes, Shield, Package, Search, Loader2, Filter,
  Calendar, DollarSign, User, ChevronLeft, Eye, Trash2,
  CheckCircle, XCircle, Clock, Edit
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  file_url?: string;
  preview_url?: string;
}

export default function ProductsManagement() {
  const locale = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [authorized, setAuthorized] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

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

        const productsRes = await api.get('/products');
        const productsData = productsRes.data.items || productsRes.data || [];
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (err) {
        console.error('Failed to load products', err);
        window.location.href = `/${locale}/admin/login`;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller?.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, statusFilter, products]);

  const handleApprove = async (productId: number) => {
    try {
      await api.put(`/products/admin/${productId}/approve`);
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: 'approved' } : p));
    } catch (err) {
      console.error('Failed to approve product', err);
    }
  };

  const handleReject = async (productId: number) => {
    const reason = rejectReason || 'Does not meet platform guidelines';
    try {
      await api.put(`/products/admin/${productId}/reject`, { reason });
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: 'rejected' } : p));
      setRejectReason('');
    } catch (err) {
      console.error('Failed to reject product', err);
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      await api.delete(`/products/${productId}`);
      setProducts(prev => prev.filter(p => p.id !== productId));
      setShowDeleteDialog(false);
    } catch (err) {
      console.error('Failed to delete product', err);
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
    total: products.length,
    pending: products.filter(p => p.status === 'pending_review').length,
    approved: products.filter(p => p.status === 'approved').length,
    rejected: products.filter(p => p.status === 'rejected').length,
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
          <Package className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Approved</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.approved}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
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
                  placeholder="Search by title, category, or seller..."
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
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">All Products ({filteredProducts.length})</CardTitle>
            <CardDescription className="text-gray-500">Manage all products on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No products found.</p>
              ) : (
                filteredProducts.map(product => (
                  <div key={product.id} className="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-purple-200 transition">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{product.title}</h4>
                          <Badge variant="outline" className={
                            product.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                              product.status === 'pending_review' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                product.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                  'bg-gray-100 text-gray-700 border-gray-200'
                          }>
                            {product.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {product.status === 'pending_review' && <Clock className="w-3 h-3 mr-1" />}
                            {product.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                            {product.status.replace('_', ' ')}
                          </Badge>
                          {product.category && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {product.category}
                            </Badge>
                          )}
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-3">${Number(product.price_usd).toFixed(2)}</p>
                        {product.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>Seller: {product.seller?.nickname || product.seller?.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {product.delivery_type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        {product.status === 'pending_review' && (
                          <>
                            <Button
                              size="sm"
                              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => handleApprove(product.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 border-red-300 text-red-700 hover:bg-red-50"
                              onClick={() => handleReject(product.id)}
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 border-red-300 text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>Complete product information</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Title</p>
                <p className="text-xl font-semibold text-gray-900">{selectedProduct.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Price</p>
                  <p className="text-2xl font-bold text-gray-900">${Number(selectedProduct.price_usd).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                  <Badge variant="outline" className={
                    selectedProduct.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                      selectedProduct.status === 'pending_review' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        'bg-red-100 text-red-700 border-red-200'
                  }>
                    {selectedProduct.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              {selectedProduct.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                  <p className="text-base text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedProduct.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Category</p>
                  <p className="text-base text-gray-900">{selectedProduct.category || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Delivery Type</p>
                  <p className="text-base text-gray-900">{selectedProduct.delivery_type}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Seller</p>
                <p className="text-base text-gray-900">{selectedProduct.seller?.nickname || 'No nickname'}</p>
                <p className="text-sm text-gray-600">{selectedProduct.seller?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Created Date</p>
                <p className="text-base text-gray-900">{new Date(selectedProduct.createdAt).toLocaleString()}</p>
              </div>
              {selectedProduct.status === 'pending_review' && (
                <div className="border-t pt-4 space-y-3">
                  <p className="text-sm font-medium text-gray-700">Review Actions</p>
                  <Textarea
                    placeholder="Rejection reason (optional)"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2"
                      onClick={() => {
                        handleApprove(selectedProduct.id);
                        setShowDetailsDialog(false);
                      }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Product
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-300 text-red-700 hover:bg-red-50 gap-2"
                      onClick={() => {
                        handleReject(selectedProduct.id);
                        setShowDetailsDialog(false);
                      }}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Product
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete "{selectedProduct?.title}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => selectedProduct && handleDelete(selectedProduct.id)}
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
