'use client'

import { useUnit } from 'effector-react'
import { isString } from 'lodash'
import { createElement, useCallback } from 'react'
import {
	$activeModal,
	closedModalFx,
	createModal,
	registerModal,
	wrongModalId,
	type OnModalClose,
} from './model'
import { Dialog } from '@/ui/dialog'

export function ModalPlugin() {
	const { id, key, modal, props: modalProps } = useUnit($activeModal)
	const isComponent = !!modal
	const { onFilter } = isComponent ? { onFilter: null } : (modalProps ?? {})
	const onClose = useCallback<OnModalClose>(
		(value, linked) => {
			if (onFilter && isString(value)) {
				const check = onFilter(value)
				if (check === false) return
			}
			closedModalFx({ result: { linked, value: value as boolean } })
		},
		[onFilter],
	)

	const elementProps = {
		id: id ?? undefined,
		key: key ?? id,
		open: !!id,
		onClose,
	}

	return isComponent
		? createElement(modal, elementProps)
		: createElement(Dialog, { ...elementProps, ...modalProps })
}

// small registry for common modals ---------------------------------------------------------------]

registerModal(wrongModalId, {
	icon: 'x',
	iconOptions: { color: 'error', size: 20 },
	title: 'Modal Id not found',
	description: 'Your [**%s**] was not found among *registered* modals.',
	labels: ['ok'],
})

registerModal('confirm-yes', {
	icon: 'alert-triangle',
	iconOptions: { color: 'error', size: 20 },
	title: 'Are you sure?',
	description: 'You will not be able to undo this action.',
	labels: ['cancel', 'yes'],
})

export const confirmYes = createModal('confirm-yes')
