/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	compress: true,
	typedRoutes: true,
	serverExternalPackages: ['knex', 'pg'],
	turbopack: {},
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
	webpack: (config, { isServer }) => {
		if (isServer) {
			config.externals = config.externals || []
			config.externals.push({
				pg: 'commonjs pg',
			})
		}
		return config
	},
}

export default nextConfig
