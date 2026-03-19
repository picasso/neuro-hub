import { includes, map, split } from 'lodash'
import { type ComponentProps, createElement, forwardRef, type ReactNode } from 'react'
import { type SemanticColor, semanticColorClasses } from './types'
import { needsContrast } from './utils'
import { cn, type MarkdownParams, simpleMarkdown } from '@/utils'

type TextStyledVariant =
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'lead'
	| 'subtitle'
	| 'body'
	| 'caption'
	| 'quote'
	| 'list'
	| 'block'

export type TextStyledProps = ComponentProps<'span'> & {
	variant?: TextStyledVariant
	color?: SemanticColor
	content?: string | number
	clean?: boolean
	strong?: boolean
	thin?: boolean
	nowrap?: boolean
	inline?: boolean
	inlineBlock?: boolean
	gutterBottom?: boolean
	md?: Partial<MarkdownParams> | false
	className?: string
	children?: ReactNode
}

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span' | 'blockquote' | 'div' | 'ul' | 'ol'

const variantTag: Record<TextStyledVariant, Tag> = {
	h1: 'h1',
	h2: 'h2',
	h3: 'h3',
	h4: 'h4',
	h5: 'h5',
	lead: 'p',
	subtitle: 'p',
	body: 'p',
	caption: 'p',
	quote: 'blockquote',
	list: 'ul',
	block: 'div',
}

const variantClasses: Record<TextStyledVariant, string> = {
	h1: 'scroll-m-20 text-4xl font-bold tracking-tight text-balance',
	h2: 'scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0',
	h3: 'scroll-m-20 text-2xl font-semibold',
	h4: 'scroll-m-20 text-xl font-semibold',
	h5: 'scroll-m-20 text-lg font-medium',
	lead: 'text-xl font-medium text-muted-foreground leading-normal',
	subtitle: 'text-sm',
	body: 'text-base',
	caption: 'text-xs',
	quote: 'text-base text-muted-foreground border-l-2 pl-4 italic leading-relaxed',
	list: 'list-disc',
	block: 'text-base',
}

const marginVars = ['h1', 'h2', 'h3', 'h4', 'h5', 'lead', 'body', 'quote', 'list'] as const
type MarginVar = (typeof marginVars)[number]
const marginClasses: Record<MarginVar, string> = {
	h1: '',
	h2: 'mt-10',
	h3: 'mt-8',
	h4: 'mt-6',
	h5: 'mt-4',
	lead: 'mt-4',
	body: '[&:not(:first-child)]:mt-2',
	quote: 'my-4',
	list: 'my-6 ml-6 [&>li]:mt-2',
}

const notRelaxed = ['h1', 'h2', 'h3', 'h4', 'h5', 'list']

export const TextStyled = forwardRef<HTMLElement, TextStyledProps>(
	(
		{
			variant: variantProp = 'body',
			color,
			content,
			clean,
			strong,
			thin,
			nowrap,
			inline,
			inlineBlock,
			gutterBottom,
			md,
			className,
			children,
			...props
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
			includes(notRelaxed, variant) && 'not-relaxed',
			variantClasses[variant],
			includes(marginVars, variant) && !clean && marginClasses[variant as MarginVar],
			color && semanticColorClasses[color],
			strong && 'font-bold',
			thin && 'font-medium',
			nowrap && 'whitespace-nowrap',
			inlineBlock && 'inline-block',
			gutterBottom && 'mb-4',
			className,
		)
		// special case for `list` variant - works only with `content` prop
		if (variant === 'list' && content) {
			return createElement(
				tag,
				{ ref, className: classes, ...props },
				map(split(content, /\r?\n|\\r\\n|\\n/), (line, index) => (
					<li key={index}>
						{md === false
							? line
							: simpleMarkdown(line, md ?? { br: inline || inlineBlock })}
					</li>
				)),
			)
		}
		const mdFixed = {
			...md,
			...(forceSpan.includes(variant) || inline || inlineBlock ? { br: true } : {}),
		}
		return createElement(
			tag,
			{ ref, className: classes, ...props },
			md === false ? value : simpleMarkdown(value, mdFixed),
		)
	},
)

// NOTE: variants in which markdown should be rendered via <span>
// even if `inline` or `inlineBlock` is not true - to avoid "<p> cannot be a descendant of <p>"
const forceSpan: TextStyledVariant[] = [
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'lead',
	'subtitle',
	'body',
	'caption',
]

export const TS = TextStyled
