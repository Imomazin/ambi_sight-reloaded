/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Keep config minimal for StackBlitz / WebContainers
  // No experimental.appDir, no turbo, nothing fancy
};

export default nextConfig;
