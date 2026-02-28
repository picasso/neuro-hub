import { createElement, forwardRef, type ReactNode } from 'react'
import { type SemanticColor, semanticColorClasses } from './types'
import { needsContrast } from './utils'
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

export type TextStyledProps = {
	variant?: TextStyledVariant
	color?: SemanticColor
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
		const contrast = needsContrast(null, color)
		const classes = cn(
			'text-styled-root markdown-root',
			contrast && 'contrast',
			variantClasses[variant],
			color && semanticColorClasses[color],
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

export const TS = TextStyled
