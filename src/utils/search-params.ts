export function normalizeSearchParams(raw: Record<string, string | string[] | undefined>) {
	return Object.fromEntries(
		Object.entries(raw)
			.map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
			.filter(([, value]) => value !== undefined),
	)
}
