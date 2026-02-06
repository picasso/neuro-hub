import dayjs, { type Dayjs } from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import { upperFirst } from 'lodash'

dayjs.extend(relativeTime)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(utc)

export { dayjs }

// formats a date as a relative time string (e.g., 'a few seconds ago', '2 hours ago').
// returns 'Just now' for very recent times and capitalizes the result.
export function formatDistance(date?: Date | Dayjs, withoutAgo?: boolean) {
	const formatted = date ? dayjs(date).fromNow(withoutAgo) : null
	return upperFirst(formatted === 'a few seconds ago' ? 'Just now' : (formatted ?? ''))
}

// runtime assertion that throws an error if the condition is falsy.
// optionally logs the assertion failure.
export function assert<T>(ok: T, message = 'failed'): asserts ok {
	if (!ok) {
		const error = new Error(message)
		const isTest = process.env.NODE_ENV === 'test'
		// NOTE: skip logging for Unit Tests
		if (!isTest) {
			if (typeof dev !== 'undefined') dev.info('{!assertion}', message)
			// eslint-disable-next-line no-console
			else console.log('ASSERTION: ' + message)
		}
		// TODO: maybe we'll use `Sentry` someday?
		// trackError(message, error)
		throw error
	}
}

// sleeps for the specified number of milliseconds.
export async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
