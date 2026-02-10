import MuiButton, { type ButtonProps as MuiButtonProps } from '@mui/material/Button'
import { castArray } from 'lodash'
import { forwardRef, useMemo } from 'react'
import { Icon, type IconProps, type IconOptions } from './icon'

export type ButtonProps = MuiButtonProps<
	'button',
	{
		label?: string
		thin?: boolean
		noWrap?: boolean
		leftIcon?: IconProps['name']
		rightIcon?: IconProps['name']
		iconOptions?: Omit<IconOptions, 'limitLowerSize'>
	}
>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ disabled, noWrap, label, thin, leftIcon, rightIcon, iconOptions, sx, children, ...props },
		ref,
	) => {
		const options = useMemo(
			() => ({
				sx: castArray({
					ml: rightIcon ? iconOptions?.spacing : undefined,
					mr: leftIcon ? iconOptions?.spacing : undefined,
				}),
				color: iconOptions?.color,
				animation: iconOptions?.animation,
				fontSize: iconOptions?.size,
			}),
			[iconOptions, leftIcon, rightIcon],
		)

		return (
			<MuiButton
				ref={ref}
				disabled={disabled}
				startIcon={leftIcon ? <Icon name={leftIcon} {...options} /> : undefined}
				endIcon={rightIcon ? <Icon name={rightIcon} {...options} /> : undefined}
				sx={[
					!!noWrap && { whiteSpace: 'nowrap' },
					!!thin && { fontWeight: 500 },
					...castArray(sx),
				]}
				{...props}
			>
				{label ?? children}
			</MuiButton>
		)
	},
)
