import { toSnippet } from './utils'
import { Card, Empty } from '@/ui'

type PersonCardBioProps = {
	value: string | null
	snippet?: boolean
	forcedEmpty?: boolean
	innerOnly?: boolean
}

export function PersonCardBio({ value, snippet, forcedEmpty, innerOnly }: PersonCardBioProps) {
	const content = snippet ? toSnippet(value) : value
	const inner =
		content ??
		(forcedEmpty ? (
			<Empty
				outline
				compact
				fullWidth
				dark
				align="start"
				title="Описание пока не добавлено"
				helper="Пользователь еще не заполнил публичный блок с рассказом о себе."
			/>
		) : null)
	if (!inner) return null
	return innerOnly ? (
		inner
	) : (
		<Card
			fullWidth
			size="default"
			gap="none"
			title="О себе"
			contentClassName="text-muted-foreground"
		>
			{inner}
		</Card>
	)
}
