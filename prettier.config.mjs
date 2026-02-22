import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
	useTabs: true,
	tabWidth: 4,
	semi: false,
	singleQuote: true,
	printWidth: 100,
	trailingComma: 'all',
	arrowParens: 'always',
	endOfLine: 'lf',
	bracketSpacing: true,
	jsxSingleQuote: false,
	quoteProps: 'as-needed',
	plugins: ['prettier-plugin-tailwindcss-canonical-classes'],
	tailwindcssCanonicalStylesheet: resolve(__dirname, 'src/app/globals.css'),
}
