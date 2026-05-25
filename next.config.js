/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://group-project-backend-group-4.onrender.com/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
