'use client'

import { useUnit } from 'effector-react'
import { produce } from 'immer'
import { forEach } from 'lodash'
import { useCallback } from 'react'
import { genericDomain as domain } from '@/lib/logger'

type Settings = Record<string, unknown>

// * * * $settings --------------------------------------------------------------------------------]

const resetSettings = domain.createEvent('resetSettings')
const updateSettings = domain.createEvent<Settings>('updateSettings')
const toggleSettings = domain.createEvent<keyof Settings>('toggleSettings')
const $settings = domain.createStore<Settings>({}, { name: '$settings' })

$settings.reset(resetSettings)
$settings.on(updateSettings, (store, settings) =>
	produce(store, (draft) => {
		forEach(settings, (value, key) => {
			draft[key] = value
		})
	}),
)
$settings.on(toggleSettings, (store, key) =>
	produce(store, (draft) => {
		draft[key] = !draft[key]
	}),
)

// helpers ----------------------------------------------------------------------------------------]

export function useReset<T extends Settings>(defaults: T | null = null) {
	const [reset, update] = useUnit([resetSettings, updateSettings])
	return useCallback(() => {
		reset()
		if (defaults) update(defaults)
	}, [reset, update, defaults])
}

export function useSettings<T extends Settings>() {
	return useUnit($settings) as T
}

export function useUpdateSettings<T extends Settings>() {
	const [update, toggle] = useUnit([updateSettings, toggleSettings])
	return [update as (settings: Partial<T>) => void, toggle as (key: keyof T) => void] as const
}
