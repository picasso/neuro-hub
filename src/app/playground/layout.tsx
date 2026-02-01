import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

type PlaygroundLayoutProps = {
	children: ReactNode
}

export default function PlaygroundLayout({ children }: PlaygroundLayoutProps) {
	if (process.env.NODE_ENV !== 'development') {
		notFound()
	}

	return <>{children}</>
}
