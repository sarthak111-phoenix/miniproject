/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    const rawBackendUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
    const isLocalhost = /^(https?:\/\/)?(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i.test(rawBackendUrl.trim());
    const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

    // On Vercel/cloud production, never rewrite to private loopbacks as Vercel Edge blocks private IP resolution with DNS_HOSTNAME_RESOLVED_PRIVATE
    if (isVercel && isLocalhost && !process.env.BACKEND_INTERNAL_URL && !process.env.NEXT_PUBLIC_API_URL) {
      return [];
    }

    const backendUrl = rawBackendUrl.replace(/\/$/, '');
    return [
      {
        source: '/auth/:path*',
        destination: `${backendUrl}/auth/:path*`,
      },
      {
        source: '/profile/:path*',
        destination: `${backendUrl}/profile/:path*`,
      },
      {
        source: '/schemes/:path*',
        destination: `${backendUrl}/schemes/:path*`,
      },
      {
        source: '/eligibility/:path*',
        destination: `${backendUrl}/eligibility/:path*`,
      },
      {
        source: '/ai/:path*',
        destination: `${backendUrl}/ai/:path*`,
      },
      {
        source: '/roadmap/:path*',
        destination: `${backendUrl}/roadmap/:path*`,
      },
      {
        source: '/documents/:path*',
        destination: `${backendUrl}/documents/:path*`,
      },
      {
        source: '/notifications/:path*',
        destination: `${backendUrl}/notifications/:path*`,
      },
      {
        source: '/api/admin/:path*',
        destination: `${backendUrl}/admin/:path*`,
      },
      {
        source: '/health',
        destination: `${backendUrl}/health`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
