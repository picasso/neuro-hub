import { type StackProps } from '@mui/material/Stack'
import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon'
import { castArray, isArray } from 'lodash'
import { forwardRef } from 'react'
import { theme } from '../ui-theme'
import { getIcon, type IconName } from './assets'

// size values
// xsmall:	13
// small:	16
// medium:	24
// large:	40

type IconSize = number | string

export type { IconName }
export type IconProps = SvgIconProps<
	'svg',
	{
		name: IconName
		forceSize?: IconSize | [IconSize, IconSize]
		inheritColor?: boolean
		animation?: keyof typeof theme.animations
	}
>

export type IconOptions = {
	spacing?: StackProps['spacing']
	color?: SvgIconProps['color']
	size?: SvgIconProps['fontSize']
	animation?: keyof typeof theme.animations
	fontSize?: string
	limitLowerSize?: boolean
}

// export const iconSizes = reduce(
// 	defaultTheme.components?.MuiSvgIcon?.variants,
// 	(acc, val) => {
// 		const key = val?.props?.fontSize
// 		if (key) {
// 			acc[key] = val?.style?.['fontSize' as keyof typeof val['style']]
// 		}
// 		return acc
// 	},
// 	{} as Record<'xsmall' | 'small' | 'medium' | 'large' | 'inherit' | '', string | undefined>
// )

export const Icon = forwardRef<SVGSVGElement, IconProps>(
	(
		{ name, fontSize, forceSize, color = 'default', inheritColor, animation, sx, ...props },
		ref,
	) => {
		return (
			<SvgIcon
				ref={ref}
				component={getIcon(name)}
				fontSize={fontSize}
				color={color !== 'placeholder' ? color : undefined}
				inheritViewBox
				sx={[
					color === 'placeholder' && { color: '#333333' },
					!!animation && theme.animations[animation],
					isArray(forceSize) && { width: forceSize[0], height: forceSize[1] },
					!!forceSize && !isArray(forceSize) && { fontSize: forceSize },
					!!inheritColor && { fill: 'none' },
					...castArray(sx),
				]}
				{...props}
			/>
		)
	},
)
