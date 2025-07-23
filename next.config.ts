/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración optimizada para producción
  output: 'standalone',
  
  // Solo ignorar errores si es absolutamente necesario
  eslint: {
    ignoreDuringBuilds: false, // Mejor práctica: resolver errores de ESLint
  },
  
  typescript: {
    ignoreBuildErrors: false, // Mejor práctica: resolver errores de TypeScript
  },
  
  // Optimizaciones para producción
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Configuración de imágenes si usas next/image
  images: {
    unoptimized: false,
    remotePatterns: [],
  },
}

export default nextConfig