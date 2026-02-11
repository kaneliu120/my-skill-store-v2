'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, ArrowLeft, Boxes, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
    const t = useTranslations('AdminLogin');
    const locale = useLocale();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await api.post('/auth/login', {
                email: data.email,
                password: data.password,
            });

            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Verify if admin after login
            if (response.data.user.role !== 'admin') {
                alert('Access denied: Admin only');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setLoading(false);
                return;
            }

            router.push(`/${locale}/admin`);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1115] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full" />
            </div>

            <Card className="w-full max-w-md bg-[#1a1c23] border-[#2d3139] shadow-2xl relative z-10">
                <CardHeader className="text-center pb-2">
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-white tracking-tight">
                        {t('title')}
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-2">
                        {t('subtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
                                {t('email')}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="admin@myskillstore.com"
                                    className="bg-[#111318] border-[#2d3139] text-white placeholder:text-gray-600 focus-visible:ring-purple-500 h-11 pl-4"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
                                {t('password')}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="bg-[#111318] border-[#2d3139] text-white placeholder:text-gray-600 focus-visible:ring-purple-500 h-11 pl-4"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl h-11 shadow-lg shadow-purple-900/20 transition-all active:scale-[0.98]"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        {t('submit')}
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-[#2d3139]">
                        <Link
                            href={`/${locale}`}
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('back')}
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Footer Branding */}
            <div className="absolute bottom-8 left-0 w-full text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Boxes className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest font-medium">MySkillStore Admin</span>
                </div>
            </div>
        </div>
    );
}
