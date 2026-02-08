import { MetadataRoute } from 'next';

// In a real app, you'd fetch this from your API
// For now we'll use a static list + some example dynamic IDs
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://myskillstore.dev';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Fetch products for dynamic routes
    // const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`).then((res) => res.json());

    // Static routes
    const routes = [
        '',
        '/about',
        '/contact',
        '/products',
        '/login',
        '/register',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // Example dynamic product routes (replace with real fetch in prod)
    const productRoutes = [1, 2, 3].map((id) => ({
        url: `${BASE_URL}/products/${id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, ...productRoutes];
}
