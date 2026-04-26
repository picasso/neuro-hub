import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/** Apply `.env` in cwd to `process.env` for keys that are not already set. */
export function loadCwdDotenv() {
	try {
		const p = resolve(process.cwd(), '.env')
		const raw = readFileSync(p, 'utf8')
		for (const line of raw.split('\n')) {
			const t = line.trim()
			if (!t || t.startsWith('#')) {
				continue
			}
			const eq = t.indexOf('=')
			if (eq <= 0) {
				continue
			}
			const key = t.slice(0, eq).trim()
			let v = t.slice(eq + 1).trim()
			if (v.startsWith('"') && v.endsWith('"')) {
				v = v.slice(1, -1).replace(/\\n/g, '\n')
			} else if (v.startsWith("'") && v.endsWith("'")) {
				v = v.slice(1, -1)
			}
			if (!process.env[key]) {
				process.env[key] = v
			}
		}
	} catch {
		// no .env
	}
}
