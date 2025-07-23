/** @type {import('next').NextConfig} */
const nextConfig = {
  // Agregar si tienes problemas con ESLint en build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Si tienes problemas con TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig