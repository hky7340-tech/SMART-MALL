/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@smartmall/ui', '@smartmall/types', '@smartmall/shared'],
    output: 'standalone',
    basePath: '/admin',
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
