/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    domains: ['prototype-ai-voice-search-kr8fok9me-elkholyaas-projects.vercel.app'],
  },
  reactStrictMode: true,
  swcMinify: true,
}

export default nextConfig; 