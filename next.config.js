// 本地开发环境下，禁用 TLS 证书验证以解决公司代理等导致的证书问题
// 生产环境（Vercel）不需要此设置
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trae-api-cn.mchost.guru'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ],
    formats: ['image/avif', 'image/webp']
  }
}

module.exports = nextConfig
