'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import api from '@/lib/api';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image: string;
    published_at: string;
}

export default function BlogSection({ locale }: { locale: string }) {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    const isZh = locale === 'zh';

    const mockPosts: BlogPost[] = [
        {
            id: 1,
            title: isZh ? '如何将您的行业经验转化为 AI 技能并获利' : 'How to Monetize Your Industry Expertise as AI Skills',
            slug: 'how-to-monetize-expertise',
            excerpt: isZh ? '在 AI 时代，深厚的行业洞察是新的硬通货。学习如何将其打包成可销售的数字化资产。' : 'In the AI era, deep industry insight is the new currency. Learn how to package it into tradable digital assets.',
            content: '',
            cover_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
            published_at: new Date().toISOString(),
        },
        {
            id: 2,
            title: isZh ? 'Prompt 工程：从对话到商业产品的飞跃' : 'Prompt Engineering: From Chatting to Commercial Products',
            slug: 'prompt-engineering-business',
            excerpt: isZh ? '不仅仅是聊天。发现如何构建能够解决实际商业问题的专业级 Prompt 技能。' : 'More than just chatting. Discover how to build professional-grade prompt skills that solve real business problems.',
            content: '',
            cover_image: 'https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&q=80&w=800',
            published_at: new Date().toISOString(),
        },
        {
            id: 3,
            title: isZh ? '未来已来：C2C AI 技能市场的崛起' : 'The Future is Here: Rise of the C2C AI Skill Marketplace',
            slug: 'rise-of-ai-marketplace',
            excerpt: isZh ? '为什么说去中心化的技能交易是 AI 开发者和创作者的下一个重大机遇？' : 'Why decentralized skill trading is the next big opportunity for AI developers and creators.',
            content: '',
            cover_image: 'https://images.unsplash.com/photo-1684369585053-5e76d338f0be?auto=format&fit=crop&q=80&w=800',
            published_at: new Date().toISOString(),
        }
    ];

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/blog', { params: { status: 'published' } });
                if (res.data && res.data.length > 0) {
                    setPosts(res.data.slice(0, 3));
                } else {
                    setPosts(mockPosts);
                }
            } catch (error) {
                console.error('Failed to fetch blog posts, falling back to mock content', error);
                setPosts(mockPosts);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [locale]);

    if (loading) {
        return <div className="col-span-1 md:col-span-3 text-center py-8 text-purple-600">Loading insights...</div>;
    }

    return (
        <>
            {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-xl transition-all duration-300 flex flex-col h-full border-gray-100 bg-white overflow-hidden group">
                    {post.cover_image && (
                        <div className="h-48 overflow-hidden">
                            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                        </div>
                    )}
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(post.published_at).toLocaleDateString()}</span>
                        </div>
                        <CardTitle className="text-lg font-bold leading-snug group-hover:text-purple-600 transition-colors">
                            <Link href={`/${locale}/blog/${post.slug || post.id}`}>
                                {post.title}
                            </Link>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col pt-0">
                        <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                            {post.excerpt || post.content.substring(0, 100) + '...'}
                        </p>
                        <Link href={`/${locale}/blog/${post.slug || post.id}`} className="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm font-semibold transition-colors">
                            {isZh ? '阅读更多' : 'Read More'} <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}
