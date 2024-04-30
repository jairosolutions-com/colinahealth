/** @type {import('next').NextConfig} */
const nextConfig = {
  
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000", // Specify the port if different from the default 80 for http or 443 for https
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
