import { noop, transform } from 'lodash'
import debug, { type DevTools } from './debug'
import { dayjs } from '@/utils'

// NOTE: debug helpers ----------------------------------------------------------------------------]

const dev: DevTools = debug
// copy of `DevTools` with `silent` loggers
const devNone: DevTools = transform(
	dev,
	(acc, _, key) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		acc[key] = noop
	},
	{} as DevTools,
)

// make `DevTools` available from global scope
if (typeof window !== 'undefined') {
	const isDevelopment = process.env.NODE_ENV === 'development'
	window.dev = isDevelopment ? dev : devNone
	if (isDevelopment) {
		// for quick tests with `lodash` - use default import for dev console
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		window._ = require('lodash')
		// for quick tests with `dayjs`
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		window.dayjs = dayjs
	}
}
