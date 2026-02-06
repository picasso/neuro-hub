import { forEach, isArray, isString, some, trimStart } from 'lodash'

const trim = (test: string) => trimStart(test, '.')
const defaultPredicate = (test: string | string[]) => {
	return (el: HTMLElement) => {
		if (isArray(test)) return some(test, (t) => el.classList.contains(trim(t)))
		else return el.classList.contains(trim(test))
	}
}

export const findParent = (
	element: HTMLElement | null | undefined,
	findPredicate: string | string[] | ((el: HTMLElement) => boolean),
	limit?: string,
) => {
	const predicate =
		isString(findPredicate) || isArray(findPredicate)
			? defaultPredicate(findPredicate)
			: findPredicate
	let currentElement = element
	if (currentElement) {
		while (currentElement) {
			if (predicate(currentElement)) return currentElement
			// if `limit` is set and found - abort the search
			if (limit && currentElement?.classList.contains(trim(limit))) {
				return null
			}
			currentElement = currentElement.parentElement
		}
	}
	return null
}

export const findChild = (
	element: HTMLElement | null | undefined,
	findPredicate: string | ((el: HTMLElement) => boolean),
) => {
	const predicate = isString(findPredicate)
		? (el: HTMLElement) => el.classList.contains(trim(findPredicate))
		: findPredicate
	if (element) {
		if (predicate(element)) return element
		let found = null
		forEach(element.children, (el) => {
			found = findChild(el as HTMLElement, predicate)
			if (found) return false
			return true
		})
		return found
	}
	return null
}
