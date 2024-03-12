/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: ['http://localhost:3000']
        }
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'caddy',
                port: "8000",
            },
        ],

    }
};

export default nextConfig;
