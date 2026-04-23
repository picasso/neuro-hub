import { isArray, isPlainObject, isString, map, transform } from 'lodash'
import type { ApiResponse } from '@/utils'

export type ClientApiError = Error & {
	code?: string
	statusCode?: number
	errors?: Record<string, string[]>
}

type RequestJsonHeaders = HeadersInit | undefined
type NormalizeJsonOptions = {
	omitEmptyStrings?: boolean
	omitNulls?: boolean
	omitEmptyArrays?: boolean
}

export type RequestJsonOptions = Omit<RequestInit, 'body'> & {
	fallbackMessage?: string
	json?: unknown
	body?: BodyInit | null
	normalizeJson?: NormalizeJsonOptions
}

export async function requestJson<T>(
	input: RequestInfo | URL,
	options?: RequestJsonOptions,
): Promise<T> {
	const {
		fallbackMessage = 'Request failed',
		json,
		headers,
		normalizeJson,
		...restOptions
	} = options ?? {}
	const init = buildRequestInit({
		...restOptions,
		headers,
		json,
		normalizeJson,
	})
	const response = await fetch(input, init)
	const responseJson = (await response.json().catch(() => null)) as ApiResponse<T> | null

	if (!response.ok || !responseJson?.success) {
		throw createClientApiError(responseJson, response.status, fallbackMessage)
	}

	return responseJson.data
}

function createClientApiError(
	json: ApiResponse<unknown> | null,
	statusCode: number,
	fallbackMessage: string,
): ClientApiError {
	if (!json || json.success) {
		return Object.assign(new Error(fallbackMessage), { statusCode })
	}

	return Object.assign(new Error(json.error.message || fallbackMessage), {
		code: json.error.code,
		statusCode: json.error.statusCode ?? statusCode,
		errors: json.error.errors,
	})
}

function buildRequestInit(options: Omit<RequestJsonOptions, 'fallbackMessage'>): RequestInit {
	const { json, headers, body, method, normalizeJson, ...requestInit } = options

	if (json === undefined) {
		return {
			...requestInit,
			method,
			headers,
			body,
		}
	}

	const normalizedJson = normalizeJsonPayload(json, normalizeJson)

	return {
		...requestInit,
		method,
		headers: withJsonContentType(headers),
		body: JSON.stringify(normalizedJson),
	}
}

function withJsonContentType(headers: RequestJsonHeaders): HeadersInit {
	const normalized = new Headers(headers)
	if (!normalized.has('content-type')) {
		normalized.set('content-type', 'application/json')
	}
	return normalized
}

function normalizeJsonPayload(value: unknown, options?: NormalizeJsonOptions): unknown {
	let normalized = value

	if (options?.omitEmptyStrings) {
		normalized = omitEmptyStrings(normalized)
	}

	if (options?.omitNulls) {
		normalized = omitNulls(normalized)
	}

	if (options?.omitEmptyArrays) {
		normalized = omitEmptyArrays(normalized)
	}

	return normalized
}

function omitEmptyStrings(value: unknown): unknown {
	return fixJsonValue(value, (v) => (isString(v) ? (v.trim() === '' ? undefined : v) : v))
}

function omitNulls(value: unknown): unknown {
	return fixJsonValue(value, (v) => (v === null ? undefined : v))
}

function omitEmptyArrays(value: unknown): unknown {
	return fixJsonValue(value, (v) => (isArray(v) ? (v.length === 0 ? undefined : v) : v))
}

function fixJsonValue(value: unknown, fn: (v: unknown) => unknown): unknown {
	if (isArray(value)) {
		return map(value, fn)
	}
	return isPlainObject(value)
		? transform(
				value as Record<string, unknown>,
				(acc, v, key) => {
					acc[key] = fn(v)
				},
				{} as Record<string, unknown>,
			)
		: value
}
