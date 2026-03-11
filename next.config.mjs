/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	compress: true,
	typedRoutes: true,
	serverExternalPackages: ['knex', 'pg'],
	turbopack: {},
	experimental: {},
	images: {
		formats: ['image/avif', 'image/webp'],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'raw.githubusercontent.com',
				pathname: '/**',
			},
		],
		localPatterns: [
			// allow any asset from public/ to work with next/image as usual
			// playground route still works because it also maps to a local pathname
			// and we omit `search` to allow any query string.
			{ pathname: '/**' },
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
