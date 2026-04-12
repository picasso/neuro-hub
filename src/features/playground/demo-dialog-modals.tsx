import { memo } from 'react'
import { createModal, createModalWithIds, registerModal } from '../../modals/model'
import { text } from './mock'
import { Button, Stack, TS } from '@/ui'

registerModal('demo-test', {
	icon: 'badge-check',
	title: 'Rule them all?',
	iconOptions: { color: 'info' },
	showFooterClose: true,
	description: text.lorem.long,
})

registerModal('demo-duplicate', {
	title: 'Some Materials already exist in Storage',
	description:
		'You can reuse `existing` entities, delete **duplicate** materials from this plate' +
		' or cancel registration and update plate',
	actions: [
		{ id: 'cancel', label: 'Cancel registration', variant: 'ghost' },
		{ id: 'delete', label: 'Delete duplicates', variant: 'destructive', leftIcon: 'trash' },
		{ id: 'reuse', label: 'Reuse existing', variant: 'default', leftIcon: 'check' },
	],
})

registerModal('my-best-modal', {
	title: 'Some materials already exist in Storage',
	icon: 'sliders-horizontal',
	iconOptions: { color: 'warning' },
	actionsPosition: 'center',
	description:
		'You can reuse `existing` entities, delete **duplicate** materials from this plate' +
		' or cancel registration and update plate',
	actions: [
		{ id: 'cancel', label: 'Cancel registration', variant: 'ghost' },
		{ id: 'delete', label: 'Delete duplicates', variant: 'destructive', leftIcon: 'trash' },
		{ id: 'reuse', label: 'Reuse existing', variant: 'default', leftIcon: 'check' },
	],
})

const duplicateConfirm = createModalWithIds('demo-duplicate')

const confirm = createModal('demo-test')

const confirmErr = createModal<string, null, string[]>('my-best-modal', ({ result }) =>
	result.value ? result : { value: 'cancel', linked: [] },
)

type Props = {
	setValue: (value: unknown) => void
}
const Demo = ({ setValue }: Props) => {
	const modalBasic = async () => {
		dev.info('{opening modal}')
		const result = await confirm()
		dev.info(`{${result ? '*' : '!'}resulted}`, { result })
		setValue(result)
	}

	const modalOverrides = async () => {
		dev.info('{opening modal}')
		const result = await confirm({
			title: 'New Title',
			iconOptions: { color: 'error' },
			actionsPosition: 'center',
			showFooterClose: false,
			labels: ['no', 'yes'],
		})
		dev.info(`{${result ? '*' : '!'}${result ? 'yes' : 'no'}}`, { result })
		setValue(result)
	}

	const modalDuplicate = async () => {
		dev.info('{opening modal}')
		const result = await duplicateConfirm()
		dev.info(`{${result === 'cancel' ? '!' : '*'}resulted}`, result)
		setValue(result)
	}

	const modalLinkedData = async () => {
		dev.info('{opening modal}')
		const result = await confirmErr({
			linkedData: { reuse: ['already used'], delete: ['x', 'x2', 'x3'], cancel: ['-'] },
		})
		dev.info(`{${result.value === 'cancel' ? '!' : '*'}resulted}`, result)
		setValue(result.value)
	}

	return (
		<Stack vertical gap={4} align="stretch" className="mt-4">
			<Stack gap={4} align="center">
				<Button size="sm" variant="default" onClick={modalBasic} label="Basic" />
				<Button size="sm" variant="outline" onClick={modalOverrides} label="Overrides" />
				<Button size="sm" variant="ghost" onClick={modalDuplicate} label="Duplicate" />
				<Button
					size="sm"
					variant="destructive"
					onClick={modalLinkedData}
					label="LinkedData"
				/>
			</Stack>
			<TS variant="caption" color="dimmed">
				See the results of actions in the console
			</TS>
		</Stack>
	)
}

export const ModalDemo = memo(Demo)
