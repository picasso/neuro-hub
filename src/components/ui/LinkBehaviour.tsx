import NextLink from 'next/link'
import { forwardRef } from 'react'

export const LinkBehaviour = forwardRef<
	HTMLAnchorElement,
	React.ComponentPropsWithoutRef<typeof NextLink>
>(function LinkBehaviour(props, ref) {
	return <NextLink ref={ref} {...props} />
})
