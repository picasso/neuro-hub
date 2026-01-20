/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	compress: true,
	typedRoutes: true,
	experimental: {
		optimizePackageImports: ['@mui/material', '@mui/icons-material'],
	},
	compiler: {
		emotion: true,
	},
	images: {
		formats: ['image/avif', 'image/webp'],
		remotePatterns: [],
	},
}

export default nextConfig
