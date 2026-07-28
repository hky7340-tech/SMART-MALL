/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
    domains: ['picsum.photos', 'ui-avatars.com', 'smartmall.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // API proxy handled by pages/api/* routes instead

  // Tự động chuyển hướng từ trang chủ / sang trang /users
  async redirects() {
    return [
      {
        source: '/',
        destination: '/users',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;