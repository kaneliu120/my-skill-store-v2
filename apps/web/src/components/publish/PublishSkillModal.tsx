'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, DollarSign } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/components/auth/AuthContext';

interface PublishSkillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES = [
  { id: 'ai-chatbots', label: 'AI Chatbots', labelZh: 'AI聊天机器人' },
  { id: 'content-creation', label: 'Content Creation', labelZh: '内容创作' },
  { id: 'productivity', label: 'Productivity', labelZh: '生产力工具' },
  { id: 'education', label: 'Education', labelZh: '教育学习' },
  { id: 'business', label: 'Business', labelZh: '商业应用' },
  { id: 'development', label: 'Development', labelZh: '开发工具' },
  { id: 'design', label: 'Design', labelZh: '设计创意' },
  { id: 'other', label: 'Other', labelZh: '其他' },
];

export default function PublishSkillModal({ open, onOpenChange }: PublishSkillModalProps) {
  const router = useRouter();
  const locale = useLocale();
  const { isLoggedIn, requireAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const isZh = locale === 'zh';

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    demo_url: '',
    delivery_type: 'manual',
    delivery_content: '',
    preview_image_url: '',
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await api.post('/upload?folder=products', body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({ ...prev, preview_image_url: res.data.url }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!requireAuth(() => {})) {
      return;
    }

    setLoading(true);
    try {
      await api.post('/products', {
        ...formData,
        price_usd: parseFloat(formData.price),
        status: 'pending_review',
      });

      // Success - close modal and redirect
      onOpenChange(false);
      router.push(`/${locale}/user`);
    } catch (error: any) {
      console.error('Failed to publish skill:', error);
      alert(error.response?.data?.message || 'Failed to publish skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {isZh ? '发布技能' : 'Publish Your Skill'}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            {isZh
              ? '填写技能信息，让您的AI技能被全球用户发现并购买'
              : 'Fill in the skill details to let users discover and purchase your AI skill'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              {isZh ? '技能名称' : 'Skill Title'} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              required
              placeholder={isZh ? '输入技能名称（例如：智能客服助手）' : 'Enter skill title (e.g., Smart Customer Service Bot)'}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="h-11"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              {isZh ? '技能类别' : 'Category'} <span className="text-red-500">*</span>
            </Label>
            <Select
              required
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder={isZh ? '选择类别' : 'Select category'} />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {isZh ? cat.labelZh : cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview Image */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-medium text-gray-700">
              {isZh ? '预览图 (选填)' : 'Preview Image (Optional)'}
            </Label>
            <div className="flex items-center gap-4">
              {formData.preview_image_url && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                  <img src={formData.preview_image_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="h-11 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>
              {uploading && <Loader2 className="w-5 h-5 animate-spin text-purple-600" />}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              {isZh ? '技能描述' : 'Description'} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              required
              placeholder={isZh ? '详细描述您的技能功能和优势...' : 'Describe your skill features and benefits...'}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium text-gray-700">
              {isZh ? '价格（美元）' : 'Price (USD)'} <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder={isZh ? '设置价格（例如：99.00）' : 'Set price (e.g., 99.00)'}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="pl-9 h-11"
              />
            </div>
          </div>

          {/* Delivery Type */}
          <div className="space-y-2">
            <Label htmlFor="delivery_type" className="text-sm font-medium text-gray-700">
              {isZh ? '交付方式' : 'Delivery Type'} <span className="text-red-500">*</span>
            </Label>
            <Select
              required
              value={formData.delivery_type}
              onValueChange={(value) => setFormData({ ...formData, delivery_type: value })}
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">{isZh ? '手动交付' : 'Manual Delivery'}</SelectItem>
                <SelectItem value="auto_hosted">{isZh ? '自动托管' : 'Auto-hosted'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Delivery Content */}
          <div className="space-y-2">
            <Label htmlFor="delivery_content" className="text-sm font-medium text-gray-700">
              {isZh ? '交付内容 / 自动发货密钥' : 'Delivery Content / Key'} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="delivery_content"
              required
              placeholder={isZh ? '如果是自动托管，请输入发货密钥或下载链接。如果是手动，请输入联系方式或说明。' : 'For auto-hosted, enter the key or link. For manual, enter instructions.'}
              value={formData.delivery_content}
              onChange={(e) => setFormData({ ...formData, delivery_content: e.target.value })}
              className="h-20"
            />
          </div>

          {/* Demo URL */}
          <div className="space-y-2">
            <Label htmlFor="demo_url" className="text-sm font-medium text-gray-700">
              {isZh ? '演示链接（选填）' : 'Demo URL (Optional)'}
            </Label>
            <Input
              id="demo_url"
              type="url"
              placeholder={isZh ? '技能演示或视频链接' : 'Skill demo or video URL'}
              value={formData.demo_url}
              onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
              className="h-11"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11"
              disabled={loading}
            >
              {isZh ? '取消' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-purple-600 hover:bg-purple-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isZh ? '发布中...' : 'Publishing...'}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {isZh ? '发布技能' : 'Publish Skill'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
