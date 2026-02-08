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
  async rewrites() {
    // ⚠️ 终极方案：由于 Render 环境变量注入不稳定，直接硬编码后端地址
    const apiUrl = process.env.SERVER_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://my-skill-api-kane.onrender.com';
    
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
