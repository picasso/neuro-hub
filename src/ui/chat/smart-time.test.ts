import { smartTime } from './smart-time'

describe('smartTime', () => {
	const now = new Date(2026, 3, 4, 16, 30)

	it('formats same-day timestamps as time only', () => {
		const timestamp = new Date(2026, 3, 4, 14, 15).toISOString()

		expect(smartTime(timestamp, now)).toBe('14:15')
	})

	it('formats yesterday with time', () => {
		const timestamp = new Date(2026, 3, 3, 20, 16).toISOString()

		expect(smartTime(timestamp, now)).toBe('вчера 20:16')
	})

	it('formats recent weekdays with time', () => {
		const timestamp = new Date(2026, 3, 2, 12, 33).toISOString()

		expect(smartTime(timestamp, now)).toBe('четверг 12:33')
	})

	it('formats older same-year dates without the year', () => {
		const timestamp = new Date(2026, 3, 5, 12, 0).toISOString()

		expect(smartTime(timestamp, now)).toBe('5.04')
	})

	it('formats previous-year dates with the year', () => {
		const timestamp = new Date(2025, 0, 13, 12, 0).toISOString()

		expect(smartTime(timestamp, now)).toBe('13.01.25')
	})

	it('returns the original value for invalid timestamps', () => {
		expect(smartTime('Вчера', now)).toBe('Вчера')
	})
})
