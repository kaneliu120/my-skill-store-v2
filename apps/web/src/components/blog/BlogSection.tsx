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

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/blog', { params: { status: 'published' } });
                setPosts(res.data.slice(0, 3));
            } catch (error) {
                console.error('Failed to fetch blog posts', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div className="col-span-3 text-center py-8">Loading...</div>;
    }

    if (posts.length === 0) {
        return (
            <div className="col-span-3 text-center text-gray-500 py-8">
                No blog posts yet.
            </div>
        );
    }

    return (
        <>
            {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition flex flex-col h-full border-gray-200 bg-white">
                    {post.cover_image && (
                        <div className="h-48 overflow-hidden rounded-t-xl">
                            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                        </div>
                    )}
                    <CardHeader>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(post.published_at).toLocaleDateString()}</span>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">
                            <Link href={`/${locale}/blog/${post.slug || post.id}`} className="hover:text-purple-600 transition">
                                {post.title}
                            </Link>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                            {post.excerpt || post.content.substring(0, 100) + '...'}
                        </p>
                        <Link href={`/${locale}/blog/${post.slug || post.id}`} className="mt-auto">
                            <Button variant="link" className="p-0 h-auto text-purple-600 hover:text-purple-700 font-medium">
                                Read More <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}
