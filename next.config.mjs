/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	compress: true,
	experimental: {
		optimizePackageImports: ['@mui/material', '@mui/icons-material'],
		typedRoutes: true,
	},
	compiler: {
		emotion: true,
	},
	images: {
		formats: ['image/avif', 'image/webp'],
		remotePatterns: [],
	},
	webpack: (config) => {
		config.resolve.extensionAlias = {
			'.js': ['.js', '.ts', '.tsx'],
		}
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
			use: ['@svgr/webpack'],
		})
		return config
	},
}

export default nextConfig
