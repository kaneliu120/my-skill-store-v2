import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: 'standalone', // 开启 Docker 优化模式
  experimental: {
    // 允许跨域图片（如果需要展示用户上传的图片）
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    // 允许在生产构建中存在 lint 错误
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 允许在生产构建中存在类型错误
    ignoreBuildErrors: true,
  },
  async rewrites() {
    // ⚠️ 终极方案：由于 Render 环境变量注入不稳定，直接硬编码后端地址
    const apiUrl = process.env.SERVER_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://skills-store-api-bjbddhaeathndkap.southeastasia-01.azurewebsites.net';

    console.log(`[Next.js Rewrite] Configuring proxy to: ${apiUrl}`);

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
// force rebuild 1770395130
