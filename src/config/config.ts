import * as process from 'process'
import packageJson from '../../package.json'
import { BASE_URL } from './metadata/constants'

const isDevEnv = process.env.NODE_ENV === 'development'

export const config = {
	isDev: isDevEnv,
	isProd: !isDevEnv,
	version: packageJson.version ?? '0.0.0',
	baseUrl: isDevEnv ? '' : BASE_URL,
	debugAuthErrors: process.env.DEBUG_AUTH_ERRORS ?? false,
	isPlaygroundAvailable: true,

	// NOTE: * * * C A C H E D * * * seeds --------------------------------------------------------]

	// 0 or `false` to disable
	// to set the cache time, you can use a string like: 100 s, 10 minutes, 2 days, 1w
	// list of all available units:  https://day.js.org/docs/en/manipulate/add
	cachedSeeds: '2 hours',
	cachedKey: 'dotmatics-aw',
}
