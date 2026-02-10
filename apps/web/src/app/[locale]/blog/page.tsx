import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';

async function getPosts() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog?status=published`, {
            cache: 'no-store'
        });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error('Failed to fetch posts', error);
        return [];
    }
}

export async function generateMetadata() {
    return {
        title: 'Blog | MySkillStore',
        description: 'Insights, tutorials, and updates from MySkillStore.',
    };
}

export default async function BlogPage({ params }: { params: { locale: string } }) {
    const posts = await getPosts();
    const { locale } = await params;

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-6">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">MySkillStore Blog</h1>
                <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
                    Discover the latest trends in AI, learn how to monetize your skills, and get updates on our platform features.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                        <Card key={post.id} className="hover:shadow-lg transition flex flex-col h-full border-gray-200">
                            {post.cover_image && (
                                <div className="h-48 overflow-hidden rounded-t-xl">
                                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                                </div>
                            )}
                            <CardHeader>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{new Date(post.published_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        <span>{post.author}</span>
                                    </div>
                                </div>
                                <CardTitle className="text-xl line-clamp-2">
                                    <Link href={`/${locale}/blog/${post.slug || post.id}`} className="hover:text-purple-600 transition">
                                        {post.title}
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                                <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
                                    {post.excerpt || post.content.substring(0, 150) + '...'}
                                </p>
                                <Link href={`/${locale}/blog/${post.slug || post.id}`} className="w-full">
                                    <Button variant="outline" className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 group">
                                        Read Article
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-gray-500">No posts published yet. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
