import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fullTime, fullTimeMonth, smartTime } from './smart-time'
import { dayjs } from '@/utils/common'

describe('smartTime', () => {
	const now = new Date(2026, 3, 4, 16, 30)

	it('formats same-day timestamps as time only when withTime is true', () => {
		const timestamp = '2026-04-04T14:15:00'

		expect(smartTime(timestamp, true, now)).toBe('14:15')
	})

	it('accepts a Date instance for the timestamp', () => {
		const timestamp = new Date(2026, 3, 4, 14, 15)

		expect(smartTime(timestamp, true, now)).toBe('14:15')
	})

	it('accepts a Dayjs instance for the timestamp', () => {
		const timestamp = dayjs('2026-04-04T14:15:00')

		expect(smartTime(timestamp, true, now)).toBe('14:15')
	})

	it('treats null as the reference "now" instant', () => {
		expect(smartTime(null, true, now)).toBe('16:30')
		expect(smartTime(null, false, now)).toBe('совсем недавно')
	})

	it('treats undefined as the reference "now" instant', () => {
		expect(smartTime(undefined, true, now)).toBe('16:30')
		expect(smartTime(undefined, false, now)).toBe('совсем недавно')
	})

	it('formats same-day with withTime false: same minute', () => {
		const timestamp = '2026-04-04T16:30:00'

		expect(smartTime(timestamp, false, now)).toBe('совсем недавно')
	})

	it('formats same-day with withTime false: same hour, different minute', () => {
		const timestamp = '2026-04-04T16:15:00'

		expect(smartTime(timestamp, false, now)).toBe('несколько минут назад')
	})

	it('formats same-day with withTime false: different hour', () => {
		const timestamp = '2026-04-04T14:00:00'

		expect(smartTime(timestamp, false, now)).toBe('несколько часов назад')
	})

	it('formats yesterday with time', () => {
		const timestamp = '2026-04-03T20:16:00'

		expect(smartTime(timestamp, true, now)).toBe('вчера 20:16')
	})

	it('formats yesterday without time', () => {
		const timestamp = '2026-04-03T20:16:00'

		expect(smartTime(timestamp, false, now)).toBe('вчера')
	})

	it('formats recent weekdays (2–6 days back) with time', () => {
		const timestamp = '2026-04-02T12:33:00'

		expect(smartTime(timestamp, true, now)).toBe('четверг 12:33')
	})

	it('formats recent weekdays (2–6 days back) without time', () => {
		const timestamp = '2026-04-02T12:33:00'

		expect(smartTime(timestamp, false, now)).toBe('четверг')
	})

	it('formats same-calendar-year dates before the weekday window as D.MM when withTime is true', () => {
		const timestamp = '2026-01-15T12:00:00'

		expect(smartTime(timestamp, true, now)).toBe('15.01')
	})

	it('formats same-calendar-year dates before the weekday window as D MMMM when withTime is false', () => {
		const timestamp = '2026-01-15T12:00:00'

		expect(smartTime(timestamp, false, now)).toBe('15 января')
	})

	it('formats previous calendar years as DD.MM.YY', () => {
		const timestamp = '2025-01-13T12:00:00'

		expect(smartTime(timestamp, true, now)).toBe('13.01.25')
		expect(smartTime(timestamp, false, now)).toBe('13.01.25')
	})

	it('returns String(timestamp) for invalid string timestamps', () => {
		expect(smartTime('Вчера', true, now)).toBe('Вчера')
	})

	it('returns String(timestamp) for an invalid Date', () => {
		const invalid = new Date(Number.NaN)

		expect(smartTime(invalid, true, now)).toBe('Invalid Date')
	})
})

describe('fullTime', () => {
	const fixedInstant = new Date(2026, 3, 4, 14, 15, 0)

	it('formats a valid ISO-like string as DD.MM.YY HH:mm (ru locale)', () => {
		expect(fullTime('2026-04-04T14:15:00')).toBe('04.04.26 14:15')
	})

	it('formats a Date instance', () => {
		expect(fullTime(fixedInstant)).toBe('04.04.26 14:15')
	})

	it('formats a Dayjs instance', () => {
		expect(fullTime(dayjs('2026-04-04T14:15:00'))).toBe('04.04.26 14:15')
	})

	it('returns null for an invalid string timestamp', () => {
		expect(fullTime('not-a-date')).toBeNull()
	})

	it('returns null for an invalid Date', () => {
		expect(fullTime(new Date(Number.NaN))).toBeNull()
	})

	describe('when timestamp is null or undefined', () => {
		beforeEach(() => {
			vi.useFakeTimers()
			vi.setSystemTime(new Date(2026, 3, 4, 16, 30, 45))
		})

		afterEach(() => {
			vi.useRealTimers()
		})

		it('uses the current instant for null', () => {
			expect(fullTime(null)).toBe('04.04.26 16:30')
		})

		it('uses the current instant for undefined', () => {
			expect(fullTime(undefined)).toBe('04.04.26 16:30')
		})
	})
})

describe('fullTimeMonth', () => {
	const fixedInstant = new Date(2026, 3, 4, 14, 15, 0)

	it('formats long date without time by default', () => {
		expect(fullTimeMonth(fixedInstant)).toBe('04 апреля 2026')
	})

	it('formats short month form without time when short is true', () => {
		expect(fullTimeMonth(fixedInstant, true)).toBe('4 апреля')
	})

	it('appends time when withTime is true (long form)', () => {
		expect(fullTimeMonth(fixedInstant, false, true)).toBe('04 апреля 2026 14:15')
	})

	it('appends time when withTime is true (short form)', () => {
		expect(fullTimeMonth(fixedInstant, true, true)).toBe('4 апреля 14:15')
	})

	it('does not append time when withTime is false', () => {
		expect(fullTimeMonth(fixedInstant, false, false)).toBe('04 апреля 2026')
	})

	it('accepts a string timestamp', () => {
		expect(fullTimeMonth('2026-04-04T14:15:00', false, true)).toBe('04 апреля 2026 14:15')
	})

	it('accepts a Dayjs timestamp', () => {
		expect(fullTimeMonth(dayjs('2026-04-04T14:15:00'), true)).toBe('4 апреля')
	})

	it('returns null for an invalid string timestamp', () => {
		expect(fullTimeMonth('not-a-date')).toBeNull()
	})

	it('returns null for an invalid Date', () => {
		expect(fullTimeMonth(new Date(Number.NaN))).toBeNull()
	})

	describe('when timestamp is null or undefined', () => {
		beforeEach(() => {
			vi.useFakeTimers()
			vi.setSystemTime(new Date(2026, 10, 9, 11, 22, 0))
		})

		afterEach(() => {
			vi.useRealTimers()
		})

		it('uses the current instant for null', () => {
			expect(fullTimeMonth(null)).toBe('09 ноября 2026')
		})

		it('uses the current instant for undefined', () => {
			expect(fullTimeMonth(undefined)).toBe('09 ноября 2026')
		})

		it('formats null with short and withTime from the current instant', () => {
			expect(fullTimeMonth(null, true, true)).toBe('9 ноября 11:22')
		})
	})
})
