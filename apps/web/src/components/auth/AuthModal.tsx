'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from './AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Github, Mail, Boxes, Loader2 } from 'lucide-react';

export default function AuthModal() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const isZh = locale === 'zh';
  const { showAuthModal, authModalTab, closeAuthModal, login } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(authModalTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync tab with parent
  const currentTab = showAuthModal ? (tab !== authModalTab && tab === 'login' ? tab : authModalTab) : tab;

  // Reset on open
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeAuthModal();
      setError('');
    }
  };

  // Sync internal tab when modal tab changes
  if (showAuthModal && tab !== authModalTab) {
    setTab(authModalTab);
  }

  const switchTab = (newTab: 'login' | 'register') => {
    setTab(newTab);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });
      login(response.data.access_token, response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || (isZh ? '登录失败，请检查邮箱和密码' : 'Login failed. Please check your email and password.'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.confirmPassword) {
      setError(isZh ? '两次密码不一致' : 'Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/register', {
        email: data.email,
        password: data.password,
        nickname: data.username,
      });
      login(response.data.access_token, response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || (isZh ? '注册失败' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={showAuthModal} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[440px] bg-white p-0 gap-0 rounded-2xl overflow-hidden border-gray-200">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Boxes className="w-6 h-6 text-white" />
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {tab === 'login' ? t('login.title') : t('register.title')}
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              {tab === 'login' ? t('login.subtitle') : t('register.subtitle')}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {/* Tab Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => switchTab('login')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                tab === 'login'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {isZh ? '登录' : 'Sign In'}
            </button>
            <button
              onClick={() => switchTab('register')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                tab === 'register'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {isZh ? '注册' : 'Sign Up'}
            </button>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-gray-200 hover:bg-gray-50 text-gray-700 h-10">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
            <Button variant="outline" className="border-gray-200 hover:bg-gray-50 text-gray-700 h-10">
              <Mail className="w-4 h-4 mr-2" />
              Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400">{t('login.or')}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          {/* Login Form */}
          {tab === 'login' && (
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-gray-700 text-sm">{t('login.email')}</Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="border-gray-200 focus-visible:ring-purple-500 h-10"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" className="text-gray-700 text-sm">{t('login.password')}</Label>
                  <button type="button" className="text-xs text-purple-600 hover:text-purple-700">
                    {t('login.forgot')}
                  </button>
                </div>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="border-gray-200 focus-visible:ring-purple-500 h-10"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg h-11 font-medium"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('login.submit')}
              </Button>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form className="space-y-4" onSubmit={handleRegister}>
              <div className="space-y-2">
                <Label htmlFor="reg-username" className="text-gray-700 text-sm">{t('register.username')}</Label>
                <Input
                  id="reg-username"
                  name="username"
                  type="text"
                  required
                  placeholder="cooldev"
                  className="border-gray-200 focus-visible:ring-purple-500 h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email" className="text-gray-700 text-sm">{t('login.email')}</Label>
                <Input
                  id="reg-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="border-gray-200 focus-visible:ring-purple-500 h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password" className="text-gray-700 text-sm">{t('login.password')}</Label>
                <Input
                  id="reg-password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="border-gray-200 focus-visible:ring-purple-500 h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-confirm" className="text-gray-700 text-sm">{t('register.confirmPassword')}</Label>
                <Input
                  id="reg-confirm"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="border-gray-200 focus-visible:ring-purple-500 h-10"
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="modal-terms" required className="border-gray-300 data-[state=checked]:bg-purple-600 mt-0.5" />
                <label htmlFor="modal-terms" className="text-xs text-gray-500 leading-tight">
                  {t('register.terms')}{' '}
                  <span className="text-purple-600 hover:text-purple-700 cursor-pointer">
                    {t('register.termsLink')}
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg h-11 font-medium"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('register.submit')}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
