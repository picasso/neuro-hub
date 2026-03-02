'use client'

import { useGate, useUnit } from 'effector-react'
import { Toaster } from 'sonner'
import { AlertComponent } from './alert'
import { $options, $overlay, AlertGate } from './model'

export const AlertsPlugin = () => {
	useGate(AlertGate, AlertComponent)
	const [options, overlayCount] = useUnit([$options, $overlay])

	return (
		<>
			<Toaster {...options} />
			{overlayCount > 0 && <div className="fixed inset-0 bg-black/50 z-1300" aria-hidden />}
		</>
	)
}
