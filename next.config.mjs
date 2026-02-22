/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	compress: true,
	typedRoutes: true,
	serverExternalPackages: ['knex', 'pg'],
	turbopack: {},
	experimental: {
		optimizePackageImports: ['@mui/material'],
	},
	compiler: {
		emotion: true,
	},
	images: {
		formats: ['image/avif', 'image/webp'],
		remotePatterns: [],
		localPatterns: [
			// playground dev-only route: /playground/pictures/<file>?slowMs=900&v=...
			// we omit `search` to allow any query string.
			{ pathname: '/playground/pictures/**' },
		],
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
