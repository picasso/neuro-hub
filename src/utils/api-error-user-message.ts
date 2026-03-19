export type ApiErrorPayloadPart = {
	message?: string
	errors?: Record<string, string[]>
}

const DEFAULT_GENERIC_VALIDATION_MESSAGES = new Set(['Validation failed'])

/** Field labels for project application API validation paths (Zod / server). */
export const PROJECT_APPLICATION_VALIDATION_FIELD_LABELS: Record<string, string> = {
	coverLetter: 'Сопроводительное письмо',
	proposedPrice: 'Бюджет заявки',
	proposedDeadline: 'Срок выполнения',
}

export function parseApiResponseError(json: unknown): ApiErrorPayloadPart | null {
	if (!json || typeof json !== 'object') return null
	const root = json as Record<string, unknown>
	const err = root.error
	if (!err || typeof err !== 'object') return null
	const e = err as Record<string, unknown>
	const message = typeof e.message === 'string' ? e.message : undefined
	const errors = normalizeErrorsRecord(e.errors)
	return { message, errors }
}

function normalizeErrorsRecord(raw: unknown): Record<string, string[]> | undefined {
	if (!raw || typeof raw !== 'object') return undefined
	const out: Record<string, string[]> = {}
	for (const [key, value] of Object.entries(raw)) {
		if (!Array.isArray(value)) continue
		const strings = value.filter(
			(item): item is string => typeof item === 'string' && item.length > 0,
		)
		if (strings.length > 0) out[key] = strings
	}
	return Object.keys(out).length > 0 ? out : undefined
}

export function formatApiValidationErrorDetails(
	errors: Record<string, string[]>,
	fieldLabels: Record<string, string>,
): string {
	const lines: string[] = []
	for (const [path, messages] of Object.entries(errors)) {
		const first = messages[0]
		if (!first) continue
		const label = fieldLabels[path] ?? path
		lines.push(`• ${label}: ${first}`)
	}
	return lines.join('\n')
}

type BuildUserFacingApiErrorMessageOptions = {
	fallback: string
	fieldLabels: Record<string, string>
	genericValidationMessages?: ReadonlySet<string>
	russianGenericSummary?: string
}

export function buildUserFacingApiErrorMessageFromParsed(
	parsed: ApiErrorPayloadPart | null,
	options: BuildUserFacingApiErrorMessageOptions,
): string {
	if (!parsed) return options.fallback

	const { message, errors } = parsed
	const genericSet = options.genericValidationMessages ?? DEFAULT_GENERIC_VALIDATION_MESSAGES
	const summaryForGeneric = options.russianGenericSummary ?? 'Проверьте поля формы:'

	const detailsText =
		errors && Object.keys(errors).length > 0
			? formatApiValidationErrorDetails(errors, options.fieldLabels)
			: ''

	if (detailsText) {
		const useGenericSummary =
			message === undefined || message.length === 0 || genericSet.has(message)
		const headline = useGenericSummary ? summaryForGeneric : message
		return `${headline}\n${detailsText}`
	}

	return message ?? options.fallback
}

export function buildUserFacingApiErrorMessage(
	json: unknown,
	options: BuildUserFacingApiErrorMessageOptions,
): string {
	return buildUserFacingApiErrorMessageFromParsed(parseApiResponseError(json), options)
}

export function pickFieldErrorsFromApiErrors(
	errors: Record<string, string[]> | undefined,
	fieldKeys: readonly string[],
): Partial<Record<string, string>> | undefined {
	if (!errors) return undefined
	const out: Partial<Record<string, string>> = {}
	for (const key of fieldKeys) {
		const msgs = errors[key]
		if (msgs?.[0]) out[key] = msgs[0]
	}
	return Object.keys(out).length > 0 ? out : undefined
}
