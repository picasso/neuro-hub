import { useEffect, useRef, type RefObject } from 'react'

type UseClickOutsideOptions = {
	enabled?: boolean
	eventName?: 'pointerdown' | 'mousedown' | 'click'
}

export function useClickOutside<T extends HTMLElement>(
	ref: RefObject<T | null>,
	handler: (event: MouseEvent | PointerEvent) => void,
	{ enabled = true, eventName = 'pointerdown' }: UseClickOutsideOptions = {},
) {
	const handlerRef = useRef(handler)

	useEffect(() => {
		handlerRef.current = handler
	}, [handler])

	useEffect(() => {
		if (!enabled) {
			return
		}

		function handleEvent(event: MouseEvent | PointerEvent) {
			const target = event.target
			if (!(target instanceof Node)) {
				return
			}

			if (!ref.current || ref.current.contains(target)) {
				return
			}

			handlerRef.current(event)
		}

		document.addEventListener(eventName, handleEvent)

		return () => {
			document.removeEventListener(eventName, handleEvent)
		}
	}, [enabled, eventName, ref])
}
