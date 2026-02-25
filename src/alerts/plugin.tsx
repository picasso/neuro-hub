'use client'

import Box from '@mui/material/Box'
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
			{overlayCount > 0 && (
				<Box
					sx={{
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						position: 'fixed',
						left: 0,
						top: 0,
						right: 0,
						bottom: 0,
						zIndex: (theme) => theme.zIndex.modal,
					}}
				/>
			)}
		</>
	)
}
