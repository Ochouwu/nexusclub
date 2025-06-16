/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Previene errores de exportación o SSR innecesaria
  experimental: {
    appDir: true // Asegura compatibilidad total con carpeta /app
  }
};

export default nextConfig;



