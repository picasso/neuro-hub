/**
 * Parity with `scripts/db/migrate-production.sh`: for `--production` scripts we read
 * `RAILWAY_DATABASE_URL` from `.env.production.local` when the file is present, even if
 * `loadDotenvFromCwd()` already set `DATABASE_URL` from local `.env` (the shell
 * script does not load `.env`, so the Node seeds must override explicitly).
 * On `exit`, restore the previous `DATABASE_URL` (or remove it) if we overrode.
 */
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { printEmpty, printError, printInfo } from './cli-utils'

const ENV_BASENAME = '.env.production.local'

export function resolveProductionEnvPath(cwd: string) {
	return resolve(cwd, ENV_BASENAME)
}

export function readRailwayDatabaseUrlFromEnvFile(envFilePath: string): string | null {
	if (!existsSync(envFilePath)) {
		return null
	}
	const raw = readFileSync(envFilePath, 'utf8')
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
		if (key !== 'RAILWAY_DATABASE_URL') {
			continue
		}
		let v = t.slice(eq + 1).trim()
		if (v.startsWith('"') && v.endsWith('"')) {
			v = v.slice(1, -1).replace(/\\n/g, '\n')
		} else if (v.startsWith("'") && v.endsWith("'")) {
			v = v.slice(1, -1)
		}
		return v || null
	}
	return null
}

/**
 * `--production`: if `.env.production.local` exists, use `RAILWAY_DATABASE_URL` from
 * it (overrides `DATABASE_URL` from `.env`). If the file is missing, use existing
 * `DATABASE_URL` (e.g. CI). On `exit`, restore the prior `DATABASE_URL` when we
 * overrode.
 */
export function useProductionDatabaseUrlIfRequested(cwd: string, production: boolean) {
	if (!production) {
		return
	}
	const path = resolveProductionEnvPath(cwd)
	if (!existsSync(path)) {
		if (process.env.DATABASE_URL) {
			printInfo('--production: .env.production.local not found; using existing DATABASE_URL')
			return
		}
		printEmpty()
		printError('--production: .env.production.local not found and DATABASE_URL is unset')
		printInfo('Set DATABASE_URL or add RAILWAY_DATABASE_URL to .env.production.local.')
		printEmpty()
		process.exit(1)
	}
	const url = readRailwayDatabaseUrlFromEnvFile(path)
	if (!url) {
		printEmpty()
		printError(`RAILWAY_DATABASE_URL is not set in ${path}`)
		printEmpty()
		process.exit(1)
	}
	const previous = process.env.DATABASE_URL
	if (previous && previous !== url) {
		printInfo('--production: RAILWAY_DATABASE_URL overrides local DATABASE_URL from .env')
	}
	process.env.DATABASE_URL = url
	printInfo('✅ DATABASE_URL loaded from [.env.production.local] for this script session')
	const resetOnExit = () => {
		if (previous === undefined) {
			delete process.env.DATABASE_URL
		} else {
			process.env.DATABASE_URL = previous
		}
	}
	process.once('exit', resetOnExit)
}
