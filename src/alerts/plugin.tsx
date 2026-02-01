'use client'

import { useGate } from 'effector-react'
import { Toaster } from 'sonner'
import { AlertGate } from './model'

export const AlertsPlugin = () => {
	useGate(AlertGate)

	return <Toaster position="bottom-left" visibleToasts={10} />
}
