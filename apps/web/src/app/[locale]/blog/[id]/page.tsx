import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import JsonLd from '@/components/seo/JsonLd';

async function getPost(idOrSlug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${idOrSlug}`, {
            cache: 'no-store'
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Failed to fetch post', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const post = await getPost(params.id);
    if (!post) return { title: 'Post Not Found' };

    return {
        title: post.title,
        description: post.excerpt || post.content.substring(0, 160),
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: post.cover_image ? [post.cover_image] : [],
            type: 'article',
            publishedTime: post.published_at,
            authors: [post.author],
        },
    };
}

export default async function BlogPostPage({ params }: { params: { id: string, locale: string } }) {
    const post = await getPost(params.id);

    if (!post) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        image: post.cover_image ? [post.cover_image] : [],
        datePublished: post.published_at,
        dateModified: post.updated_at,
        author: [{
            '@type': 'Person',
            name: post.author,
        }],
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            <JsonLd data={jsonLd} />

            {/* Hero Header */}
            <div className="bg-gray-900 text-white py-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-900/20 z-0"></div>
                {post.cover_image && (
                    <div className="absolute inset-0 z-0 opacity-30">
                        <img src={post.cover_image} alt="" className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="container mx-auto max-w-4xl relative z-10">
                    <Link href="/blog">
                        <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 mb-8 pl-0 gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Blog
                        </Button>
                    </Link>
                    <div className="flex items-center gap-6 text-sm text-gray-300 mb-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.published_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">{post.title}</h1>
                    {post.excerpt && <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">{post.excerpt}</p>}
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto max-w-3xl px-6 py-16">
                <article className="prose prose-lg prose-purple max-w-none">
                    {/* Simple rendering for now. In real app use a markdown parser */}
                    <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
                        {post.content}
                    </div>
                </article>

                <div className="mt-16 pt-8 border-t border-gray-100">
                    <Link href="/blog">
                        <Button variant="outline" className="rounded-full">Read More Articles</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
