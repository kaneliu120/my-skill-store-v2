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
  });

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
        status: 'pending',
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
