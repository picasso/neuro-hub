import { type DevTools } from './debug'

declare global {
	let dev: DevTools
	interface Window {
		dev: DevTools
	}
}
