/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      // fallback rewrites only run if no Next.js route handler matched first.
      // This lets /api/auth/[...nextauth] (Auth.js) handle its own routes
      // while everything else under /api/* is proxied to the backend.
      fallback: [
        {
          source: "/api/:path*",
          destination:
            "https://group-project-backend-group-4.onrender.com/api/:path*",
        },
      ],
    };
  },
};

module.exports = nextConfig;
