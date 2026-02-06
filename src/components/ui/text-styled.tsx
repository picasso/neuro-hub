import MuiTypography, { type TypographyProps as MuiTypographyProps } from '@mui/material/Typography'
import { castArray } from 'lodash'
import { forwardRef } from 'react'
import { markdownCss, type MarkdownParams, mergeClasses, simpleMarkdown } from '@/utils'

export type TextStyledProps = MuiTypographyProps & {
	// color?: ThemeColor | ThemeColorPath | 'inherit'
	content?: string | number
	strong?: boolean
	thin?: boolean
	inline?: boolean
	inlineBlock?: boolean
	md?: Partial<MarkdownParams> | false
}

export const TextStyled = forwardRef<HTMLSpanElement, TextStyledProps>(
	(
		{
			className,
			content,
			variant = 'inherit',
			color = 'inherit',
			strong,
			thin,
			inline,
			inlineBlock,
			md,
			sx,
			children,
			...props
		},
		ref,
	) => {
		const value = content ?? children
		return (
			<MuiTypography
				ref={ref}
				className={mergeClasses('TextStyled-root', className)}
				variant={variant}
				component={inline || inlineBlock ? 'span' : undefined}
				sx={[
					md !== false && markdownCss,
					{ color },
					!!inlineBlock && { display: 'inline-block' },
					!!strong && { fontWeight: 700 },
					!!thin && { fontWeight: 500 },
					...castArray(sx),
				]}
				{...props}
			>
				{md === false ? value : simpleMarkdown(value, md ?? { br: inline || inlineBlock })}
			</MuiTypography>
		)
	},
)

export const TS = TextStyled
