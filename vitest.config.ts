import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	resolve: {
		alias: {
			'@': path.join(rootDir, 'src'),
		},
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/tests/setup.ts'],
		passWithNoTests: true,
		include: [
			'**/__tests__/**/*.ts',
			'**/__tests__/**/*.tsx',
			'**/*.{test,spec}.ts',
			'**/*.{test,spec}.tsx',
		],
		exclude: [
			'**/node_modules/**',
			'**/.next/**',
			'**/dist/**',
			'**/build/**',
			'**/coverage/**',
		],
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{js,jsx,ts,tsx}'],
			exclude: ['**/*.d.ts', '**/*.stories.{js,jsx,ts,tsx}', 'src/tests/**'],
		},
	},
})
