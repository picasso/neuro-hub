'use client'

import { useEffect } from 'react'
import { createAlert } from '@/alerts'

const isDevelopment = process.env.NODE_ENV === 'development'
const STORAGE_KEY = 'dev:db-health-alert:v1'

type HealthErrorResponse = {
	success?: false
	error?: {
		code?: string
		message?: string
		statusCode?: number
	}
}

export function DbHealthAlert() {
	useEffect(() => {
		if (!isDevelopment) return
		if (typeof window === 'undefined') return

		// show once per tab/session (avoid spam on fast refresh / navigation)
		if (window.sessionStorage.getItem(STORAGE_KEY) === '1') return

		const controller = new AbortController()

		;(async () => {
			try {
				const res = await fetch('/api/health', {
					method: 'GET',
					cache: 'no-store',
					signal: controller.signal,
				})

				if (res.ok) return

				if (res.status === 503) {
					let payload: HealthErrorResponse | null = null
					try {
						payload = (await res.json()) as HealthErrorResponse
					} catch {
						// ignore
					}

					if (payload?.error?.code === 'DB_CONNECTION_ERROR') {
						window.sessionStorage.setItem(STORAGE_KEY, '1')
						createAlert({
							severity: 'error',
							title: 'DB unavailable `#development mode`',
							message:
								'**Docker** container is not running.\n' +
								'Start `!Postgres` container and refresh the page.',
							disableAutoClose: true,
							md: { br: true },
						})
					}
				}
			} catch {
				// ignore (network error, aborted, etc.)
			}
		})()

		return () => controller.abort()
	}, [])

	return null
}
