'use client'

import Stack from '@mui/material/Stack'
import { createAlert } from '@/alerts'
import { Button } from '@/components/ui'

export const AlertsDemo = () => {
	const alertInfo = () => {
		createAlert('info', 'Lorem `ipsum` dolor sit **amet**, consectetur adipiscing elit')
	}

	const alertWarn = () => {
		createAlert('warning', [
			'You can **reuse** %s entities, delete *%s* from this panel or `%s` and update panel.',
			23,
			'duplicate compounds',
			'cancel registration',
		])
	}

	const alertError = () => {
		createAlert(
			'error',
			'Sed do `eiusmod` tempor incididunt ut **labore** et dolore magna aliqua.',
		)
	}

	const alertFull = () => {
		createAlert({
			severity: 'success',
			title: 'Registered successfully',
			message: 'Lorem `ipsum dolor` sit amet, **consectetur** adipiscing elit',
			disableClose: true,
			dismissible: false,
		})
	}

	const alertProgress = () => {
		createAlert({
			severity: 'progress',
			title: 'Registering panel...',
			message: 'Lorem `ipsum` dolor sit amet, **consectetur** adipiscing elit',
			disableClose: true,
		})
	}

	const alertOverlay = () => {
		createAlert({
			severity: 'progress',
			title: 'Registering panel...',
			message: 'Lorem `ipsum` dolor sit amet, **consectetur** adipiscing elit',
			dismissible: false,
			overlay: true,
		})
	}

	return (
		<Stack direction="row" spacing={2}>
			<Button variant="outlined" color="info" onClick={alertInfo} label="Info" />
			<Button variant="outlined" color="warning" onClick={alertWarn} label="Warning" />
			<Button variant="outlined" color="error" onClick={alertError} label="Error" />
			<Button variant="outlined" color="success" onClick={alertFull} label="Success" />
			<Button variant="outlined" color="primary" onClick={alertOverlay} label="Overlay" />
			<Button variant="outlined" color="primary" onClick={alertProgress} label="Progress" />
		</Stack>
	)
}
