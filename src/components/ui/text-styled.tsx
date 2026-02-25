import MuiTypography, { type TypographyProps as MuiTypographyProps } from '@mui/material/Typography'
import { castArray, includes } from 'lodash'
import { forwardRef } from 'react'
import { STANDARD_MUI_TYPOGRAPHY_COLORS } from '@/components/ui-theme'
import { type MarkdownParams, mergeClasses, simpleMarkdown } from '@/utils'

export type TextStyledProps = MuiTypographyProps & {
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

		// check if color is a custom palette color (not in standard MUI colors)
		const isCustom = !includes(STANDARD_MUI_TYPOGRAPHY_COLORS, color)

		// for custom colors, determine the palette path
		// if it already contains a dot (e.g., 'contrast.light'), use as-is
		// otherwise, append '.main' (e.g., 'contrast' → 'contrast.main')
		const customColor = isCustom ? (includes(color, '.') ? color : `${color}.main`) : undefined

		return (
			<MuiTypography
				ref={ref}
				className={mergeClasses('TextStyled-root', 'markdown-root', className)}
				variant={variant}
				component={inline || inlineBlock ? 'span' : undefined}
				color={isCustom ? undefined : color}
				sx={[
					// apply custom color first (lower priority)
					!!isCustom && { color: customColor },
					!isCustom && !!color && { color },
					!!inlineBlock && { display: 'inline-block' },
					!!strong && { fontWeight: 700 },
					!!thin && { fontWeight: 500 },
					// user sx last (highest priority)
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
