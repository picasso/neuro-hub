import { assert, dayjs, formatDistance, sleep } from './common'

describe('common utilities', () => {
	describe('dayjs', () => {
		it('should export dayjs with plugins', () => {
			expect(dayjs).toBeDefined()
			expect(typeof dayjs).toBe('function')

			const now = dayjs()
			expect(typeof now.fromNow).toBe('function')
			expect(typeof now.isSameOrAfter).toBe('function')
			expect(typeof now.isSameOrBefore).toBe('function')
			expect(typeof now.utc).toBe('function')
		})
	})

	describe('formatDistance', () => {
		it('should return "Just now" for current time', () => {
			const now = dayjs()

			const result = formatDistance(now)

			expect(result).toBe('Just now')
		})

		it('should format past times with "ago" suffix', () => {
			const now = dayjs()

			expect(formatDistance(now.subtract(1, 'minute'))).toBe('A minute ago')
			expect(formatDistance(now.subtract(1, 'hour'))).toBe('An hour ago')
			expect(formatDistance(now.subtract(1, 'day'))).toBe('A day ago')
			expect(formatDistance(now.subtract(2, 'minutes'))).toBe('2 minutes ago')
		})

		it('should format past times without "ago" when withoutAgo is true', () => {
			const now = dayjs()

			expect(formatDistance(now.subtract(1, 'minute'), true)).toBe('A minute')
			expect(formatDistance(now.subtract(1, 'hour'), true)).toBe('An hour')
			expect(formatDistance(now.subtract(1, 'day'), true)).toBe('A day')
		})

		it('should return empty string for undefined date', () => {
			const result = formatDistance()

			expect(result).toBe('')
		})

		it('should convert "a few seconds ago" to "Just now"', () => {
			const now = dayjs()

			const result = formatDistance(now.subtract(2, 'seconds'))

			expect(result).toBe('Just now')
		})
	})

	describe('assert', () => {
		it('should not throw when condition is truthy', () => {
			expect(() => assert(true, 'This should not fail')).not.toThrow()
		})

		it('should throw when condition is falsy', () => {
			expect(() => assert(false, 'This should fail')).toThrow('This should fail')
		})

		it('should use default message when none provided', () => {
			expect(() => assert(false)).toThrow('failed')
		})

		it('should log assertion failure to console in non-test environment', () => {
			const envRestore = jest.replaceProperty(process.env, 'NODE_ENV', 'development')
			const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined)

			expect(() => assert(false, 'This should log')).toThrow('This should log')

			expect(consoleSpy).toHaveBeenCalledWith('ASSERTION: This should log')
			consoleSpy.mockRestore()
			envRestore.restore()
		})

		it('should call dev.info when dev is defined', () => {
			const envRestore = jest.replaceProperty(process.env, 'NODE_ENV', 'development')
			const mockDev = { info: jest.fn() }
			;(globalThis as { dev?: { info: (msg: string, detail: string) => void } }).dev = mockDev

			expect(() => assert(false, 'dev test')).toThrow('dev test')

			expect(mockDev.info).toHaveBeenCalledWith('{!assertion}', 'dev test')

			delete (globalThis as { dev?: { info: (msg: string, detail: string) => void } }).dev
			envRestore.restore()
		})
	})

	describe('sleep', () => {
		it('should resolve after the specified number of milliseconds', async () => {
			const start = Date.now()

			await sleep(100)

			const elapsed = Date.now() - start
			expect(elapsed).toBeGreaterThanOrEqual(90)
			expect(elapsed).toBeLessThan(150)
		})

		it('should resolve immediately for zero milliseconds', async () => {
			const start = Date.now()

			await sleep(0)

			const elapsed = Date.now() - start
			expect(elapsed).toBeLessThan(10)
		})

		it('should return a Promise', () => {
			const result = sleep(50)

			expect(result).toBeInstanceOf(Promise)
		})

		it('should resolve without a value', async () => {
			const result = await sleep(10)

			expect(result).toBeUndefined()
		})

		it('should work with different time values in parallel', async () => {
			const promises = [sleep(20), sleep(30), sleep(10)]
			const start = Date.now()

			await Promise.all(promises)

			const elapsed = Date.now() - start
			expect(elapsed).toBeGreaterThanOrEqual(25)
			expect(elapsed).toBeLessThan(60)
		})

		it('should handle negative numbers gracefully', async () => {
			const start = Date.now()

			await sleep(-100)

			const elapsed = Date.now() - start
			expect(elapsed).toBeLessThan(10)
		})
	})
})
