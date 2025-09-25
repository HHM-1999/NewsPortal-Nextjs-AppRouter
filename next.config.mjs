/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_IMG_PATH: process.env.NEXT_PUBLIC_IMG_PATH,
        NEXT_LAZY_IMAGE:process.env.NEXT_LAZY_IMAGE
      },
      images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'assets.deshkalnews.com',
            port: '',
            pathname: '**', // allow all paths from this host
          },
        ],
      },

    reactStrictMode: true
};

export default nextConfig;
