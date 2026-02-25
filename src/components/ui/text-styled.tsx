import { createElement, forwardRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { type MarkdownParams, simpleMarkdown } from '@/utils'

type TextStyledVariant =
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'subtitle'
	| 'body'
	| 'caption'
	| 'quote'
	| 'block'

type TextStyledColor = 'primary' | 'secondary' | 'dimmed' | 'contrast' | 'soft'

export type TextStyledProps = {
	variant?: TextStyledVariant
	color?: TextStyledColor
	content?: string | number
	strong?: boolean
	thin?: boolean
	inline?: boolean
	inlineBlock?: boolean
	gutterBottom?: boolean
	md?: Partial<MarkdownParams> | false
	className?: string
	children?: ReactNode
}

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span' | 'blockquote' | 'div'

const variantTag: Record<TextStyledVariant, Tag> = {
	h1: 'h1',
	h2: 'h2',
	h3: 'h3',
	h4: 'h4',
	h5: 'h5',
	subtitle: 'p',
	body: 'p',
	caption: 'p',
	quote: 'blockquote',
	block: 'div',
}

const variantClasses: Record<TextStyledVariant, string> = {
	h1: 'text-4xl font-bold tracking-tight',
	h2: 'text-3xl font-semibold tracking-tight',
	h3: 'text-2xl font-semibold',
	h4: 'text-xl font-semibold',
	h5: 'text-lg font-medium',
	subtitle: 'text-sm',
	body: 'text-base',
	caption: 'text-xs',
	quote: 'text-base text-muted-foreground my-2 border-l-2 pl-4 italic',
	block: 'text-base',
}

const colorClasses: Record<TextStyledColor, string> = {
	primary: 'text-foreground',
	secondary: 'text-muted-foreground',
	dimmed: 'text-dimmed',
	contrast: 'text-background',
	soft: 'text-background/60',
}

export const TextStyled = forwardRef<HTMLElement, TextStyledProps>(
	(
		{
			variant: variantProp = 'body',
			color,
			content,
			strong,
			thin,
			inline,
			inlineBlock,
			gutterBottom,
			md,
			className,
			children,
		},
		ref,
	) => {
		const value = content ?? children
		const variant = variantTag[variantProp] ? variantProp : 'body'
		const tag = inline || inlineBlock ? 'span' : variantTag[variant]
		const needsContrast = color === 'contrast' || color === 'soft'
		const classes = cn(
			'text-styled-root markdown-root',
			needsContrast && 'contrast',
			variantClasses[variant],
			color && colorClasses[color],
			strong && 'font-bold',
			thin && 'font-medium',
			inlineBlock && 'inline-block',
			gutterBottom && 'mb-4',
			className,
		)
		return createElement(
			tag,
			{ ref, className: classes },
			md === false ? value : simpleMarkdown(value, md ?? { br: inline || inlineBlock }),
		)
	},
)

TextStyled.displayName = 'TextStyled'
export const TS = TextStyled
