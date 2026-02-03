'use client'

import { useGate, useUnit } from 'effector-react'
import { Toaster } from 'sonner'
import { $options, AlertGate } from './model'

export const AlertsPlugin = () => {
	useGate(AlertGate)
	const options = useUnit($options)
	return <Toaster {...options} />
}
