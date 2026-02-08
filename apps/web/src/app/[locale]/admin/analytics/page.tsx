'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Activity, Globe, MousePointer } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { user, isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Simple admin check (in real app, use roles)
        // For now we just check if logged in for demo purposes, 
        // ideally backend would reject non-admins
        if (!isLoggedIn) {
            // router.push('/'); // Commented out for easier testing/demo
        }

        fetchStats();
    }, [isLoggedIn]);

    const fetchStats = async () => {
        try {
            const res = await api.get('/tracking/stats');
            setStats(res.data);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading analytics...</div>;
    }

    if (!stats) return null;

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-purple-100 p-2 rounded-lg">
                    <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Events</CardTitle>
                        <Activity className="w-4 h-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalEvents}</div>
                        <p className="text-xs text-gray-400 mt-1">All tracked interactions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Top Event Type</CardTitle>
                        <MousePointer className="w-4 h-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.topEvents?.[0]?.event_name || 'N/A'}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            {stats.topEvents?.[0]?.count || 0} occurrences
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Top Page</CardTitle>
                        <Globe className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold truncate" title={stats.topPages?.[0]?.page_url}>
                            {stats.topPages?.[0]?.page_url || 'N/A'}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            {stats.topPages?.[0]?.count || 0} visits
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Top Events Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Interactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Event Name</TableHead>
                                    <TableHead className="text-right">Count</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stats.topEvents.map((event: any, i: number) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium">{event.event_name}</TableCell>
                                        <TableCell className="text-right">{event.count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Top Pages Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Most Visited Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Page URL</TableHead>
                                    <TableHead className="text-right">Views</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stats.topPages.map((page: any, i: number) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium truncate max-w-[200px]" title={page.page_url}>
                                            {page.page_url}
                                        </TableCell>
                                        <TableCell className="text-right">{page.count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Log */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Recent Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>Event</TableHead>
                                <TableHead>Element ID</TableHead>
                                <TableHead>Page</TableHead>
                                <TableHead>Metadata</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.recentEvents.map((event: any) => (
                                <TableRow key={event.id}>
                                    <TableCell className="text-sm text-gray-500">
                                        {new Date(event.created_at).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <span className={`px-2 py-1 rounded text-xs ${event.event_name === 'page_view' ? 'bg-blue-100 text-blue-700' :
                                                event.event_name.includes('click') ? 'bg-purple-100 text-purple-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {event.event_name}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm font-mono text-gray-600">
                                        {event.element_id || '-'}
                                    </TableCell>
                                    <TableCell className="text-sm truncate max-w-[150px]" title={event.page_url}>
                                        {event.page_url}
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-500 max-w-[200px] truncate">
                                        {event.metadata ? JSON.stringify(event.metadata) : '-'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
