import { beforeEach, describe, expect, it } from 'vitest'
import { findChild, findParent } from './dom'

describe('DOM Utilities', () => {
	let mockElement: HTMLElement
	let mockParent: HTMLElement
	let mockGrandparent: HTMLElement

	beforeEach(() => {
		mockElement = document.createElement('div')
		mockElement.classList.add('child-class')

		mockParent = document.createElement('div')
		mockParent.classList.add('parent-class')
		mockParent.appendChild(mockElement)

		mockGrandparent = document.createElement('div')
		mockGrandparent.classList.add('grandparent-class')
		mockGrandparent.appendChild(mockParent)

		const sibling = document.createElement('div')
		sibling.classList.add('sibling-class')
		mockParent.appendChild(sibling)
	})

	describe('findParent', () => {
		it('should find parent element by class name', () => {
			const result = findParent(mockElement, 'parent-class')

			expect(result).toBe(mockParent)
		})

		it('should find parent element by array of class names', () => {
			const result = findParent(mockElement, ['other-class', 'parent-class'])

			expect(result).toBe(mockParent)
		})

		it('should find parent element by predicate function', () => {
			const result = findParent(mockElement, (el) => el.classList.contains('parent-class'))

			expect(result).toBe(mockParent)
		})

		it('should return null if no matching parent is found', () => {
			const result = findParent(mockElement, 'non-existent-class')

			expect(result).toBeNull()
		})

		it('should respect the limit parameter', () => {
			mockParent.classList.add('limit-class')

			const result = findParent(mockElement, 'grandparent-class', 'limit-class')

			expect(result).toBeNull()
		})

		it('should handle null element', () => {
			const result = findParent(null, 'parent-class')

			expect(result).toBeNull()
		})

		it('should handle undefined element', () => {
			const result = findParent(undefined, 'parent-class')

			expect(result).toBeNull()
		})
	})

	describe('findChild', () => {
		it('should find child element by class name', () => {
			const result = findChild(mockParent, 'child-class')

			expect(result).toBe(mockElement)
		})

		it('should find child element by predicate function', () => {
			const result = findChild(mockParent, (el) => el.classList.contains('child-class'))

			expect(result).toBe(mockElement)
		})

		it('should return null if no matching child is found', () => {
			const result = findChild(mockParent, 'non-existent-class')

			expect(result).toBeNull()
		})

		it('should handle null element', () => {
			const result = findChild(null, 'child-class')

			expect(result).toBeNull()
		})

		it('should handle undefined element', () => {
			const result = findChild(undefined, 'child-class')

			expect(result).toBeNull()
		})
	})
})
