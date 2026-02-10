'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash, Globe, FileText } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminBlogPage({ params }: { params: { locale: string } }) {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { locale } = params;
    const router = useRouter();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/blog');
            setPosts(res.data);
        } catch (error) {
            console.error('Failed to fetch posts', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            await api.delete(`/blog/${id}`);
            fetchPosts();
        } catch (error) {
            console.error('Failed to delete post', error);
        }
    };

    const togglePublish = async (post: any) => {
        try {
            await api.put(`/blog/${post.id}`, { is_published: !post.is_published });
            fetchPosts();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
                    <p className="text-gray-500">Manage your blog posts and articles.</p>
                </div>
                <Link href={`/${locale}/admin/blog/editor`}>
                    <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
                        <Plus className="w-4 h-4" /> New Post
                    </Button>
                </Link>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Published At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium max-w-[300px] truncate">
                                        {post.title}
                                        <div className="text-xs text-gray-400 truncate">{post.slug}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${post.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {post.is_published ? 'Published' : 'Draft'}
                                        </div>
                                    </TableCell>
                                    <TableCell>{post.author}</TableCell>
                                    <TableCell className="text-gray-500 text-sm">
                                        {post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => togglePublish(post)}
                                                title={post.is_published ? "Unpublish" : "Publish"}
                                            >
                                                {post.is_published ? <FileText className="w-4 h-4 text-gray-400" /> : <Globe className="w-4 h-4 text-green-600" />}
                                            </Button>
                                            <Link href={`/${locale}/admin/blog/editor?id=${post.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="w-4 h-4 text-blue-600" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
                                                <Trash className="w-4 h-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {posts.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        No blog posts found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
