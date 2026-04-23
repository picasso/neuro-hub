import clsx, { type ClassValue } from 'clsx'
import dayjs, { type Dayjs } from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import { drop, isArray, upperFirst } from 'lodash'
import { type ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

dayjs.extend(relativeTime)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(utc)

export { dayjs, type Dayjs }

// just a more familiar name
export const mergeClasses = clsx

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function sprintf(str: string, ...argv: (string | number)[]): string {
	if (!argv.length) return str
	const updatedStr = str.replace('%s', String(argv.shift()))
	return sprintf(updatedStr, ...argv)
}

export type TemplatedMessage<T = ReactNode> = T | [template: string, ...args: unknown[]]

export function templatedMessage(message: TemplatedMessage) {
	return isArray(message) ? sprintf(message[0], ...drop(message as string[])) : message
}

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

// sleeps for the specified number of milliseconds; negative ms becomes 0.
export async function sleep(ms: number) {
	const delayMs = Math.max(0, ms)
	return new Promise((resolve) => setTimeout(resolve, delayMs))
}
