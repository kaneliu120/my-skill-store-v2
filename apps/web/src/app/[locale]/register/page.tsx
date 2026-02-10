'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Github, Mail, Boxes } from 'lucide-react';

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const isZh = locale === 'zh';
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await api.post('/auth/register', {
        email: data.email,
        password: data.password,
        nickname: data.username,
      });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push('/user');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md bg-white border-gray-200 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Boxes className="w-6 h-6 text-white" />
            </div>
          </div>
          <Link href="/" className="text-2xl font-bold text-gray-900 mb-2 inline-block">
            MySkillStore
          </Link>
          <CardTitle className="text-xl text-gray-900">{t('register.title')}</CardTitle>
          <CardDescription className="text-gray-500">{t('register.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Social Register */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-gray-200 hover:bg-gray-50 text-gray-700">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
            <Button variant="outline" className="border-gray-200 hover:bg-gray-50 text-gray-700">
              <Mail className="w-4 h-4 mr-2" />
              Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">{t('login.or')}</span>
            </div>
          </div>

          {/* Register Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">{t('register.username')}</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                placeholder="cooldev"
                className="border-gray-200 focus-visible:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">{t('login.email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="border-gray-200 focus-visible:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">{t('login.password')}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="border-gray-200 focus-visible:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700">{t('register.confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                className="border-gray-200 focus-visible:ring-purple-500"
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="terms" required className="border-gray-300 data-[state=checked]:bg-purple-600" />
              <label htmlFor="terms" className="text-sm text-gray-500 leading-tight">
                {t('register.terms')}{' '}
                <Link href="/terms" className="text-purple-600 hover:text-purple-700">
                  {t('register.termsLink')}
                </Link>
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg h-11">
              {loading ? (isZh ? '处理中...' : 'Processing...') : t('register.submit')}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500">
            {t('register.hasAccount')}{' '}
            <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
              {t('register.signIn')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
