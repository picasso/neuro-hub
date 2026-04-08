import { attach, sample } from 'effector'
import { type Draft, produce } from 'immer'
import { get, has, isFunction, isString, merge } from 'lodash'
import { createElement } from 'react'
import { modalsDomain as domain } from '@/lib/logger'
import { type DialogProps } from '@/ui/dialog'

export { domain }
export const wrongModalId = '-wrong-id-'

// common types -----------------------------------------------------------------------------------]

type onFilterProps = { onFilter?: (id: string) => boolean | undefined }
export type ModalProps = Omit<DialogProps, 'onClose' | 'open'> & onFilterProps

type ModalComponentCompleted = (params?: unknown) => void
export type OnModalClose = NonNullable<DialogProps['onClose']>

type ExtraProps = Record<string, unknown>
export type ModalComponentProps<T = ExtraProps> = T & {
	open: NonNullable<DialogProps['open']>
	onClose: OnModalClose
	onCompleted?: ModalComponentCompleted
}
type ModalComponent<T = ExtraProps> = React.FunctionComponent<ModalComponentProps<T>>

type ModalItem = {
	id: string
	isCustom: boolean
	props?: ModalProps
	modal?: ModalComponent
}

type ModalStore = Record<string, ModalItem | undefined>

// * * * $modals - store for registered modals ----------------------------------------------------]

const addModal = domain.createEvent<Omit<ModalItem, 'isCustom'>>()
const removeModal = domain.createEvent<string>()

export const $modals = domain.createStore<ModalStore>({})

$modals.on(addModal, (modals, { id, modal, props }) =>
	produce(modals, (draft) => {
		draft[id] = {
			id,
			modal,
			props: props as Draft<ModalProps>,
			isCustom: !!modal,
		}
	}),
)

$modals.on(removeModal, (modals, id) =>
	produce(modals, (draft) => {
		if (draft[id]) delete draft[id]
	}),
)

// store for 'active' modal with options ----------------------------------------------------------]

type OnCloseReturn<T, L> = {
	result: { linked: L; value: T | null }
}

type ModalPropsExtended = ModalProps & Pick<ModalComponentProps, 'onCompleted'>
export type PropsOverride = ModalPropsExtended | ((props: ModalProps) => ModalPropsExtended)

type ModalReturn<T = boolean, L = unknown> =
	| T
	| (OnCloseReturn<T, L> & Omit<ModalActiveItem, 'map' | 'resolver'>)

type ReturnMap<T = boolean, L = unknown> =
	| true
	| ((data: Exclude<ModalReturn<T, L>, T>) => T | { linked: L; value: T | null })

type ModalResolver = (data: unknown) => void

type ModalActiveItem = {
	id: string | null
	key?: string
	resolver: ModalResolver | null
	modal?: ModalComponent
	props?: ModalProps
	map?: ReturnMap
}

type GotModalParam = Omit<ModalActiveItem, 'modal'> & { override?: PropsOverride }
const gotModal = domain.createEvent<GotModalParam>()
const setModal = domain.createEvent<ModalActiveItem>()
const resetModal = domain.createEvent()

const inactiveModal: ModalActiveItem = { id: null, resolver: null }
export const $activeModal = domain
	.createStore<ModalActiveItem>(inactiveModal)
	.on(setModal, (_, params) => params)
	.reset(resetModal)

function modalOnCompleted(modal: ModalComponent, extraProps?: ExtraProps) {
	return ((props) => createElement(modal, { ...props, ...extraProps })) as ModalComponent
}

function mergeProps(modal?: ModalComponent, props?: ModalProps, override?: PropsOverride) {
	if (override) {
		if (modal) {
			const props = isFunction(override) ? override({}) : override
			return [modalOnCompleted(modal, props), props] as const
		} else {
			return [
				modal,
				isFunction(override) ? override({ ...props }) : merge({}, props, override),
			] as const
		}
	}
	return [modal, props] as const
}

// resolve active modal from registry + optional override into `setModal`
sample({
	clock: gotModal,
	source: $modals,
	fn: (modals: ModalStore, { id, key, resolver, override, map }: GotModalParam) => {
		if (!id) return inactiveModal
		if (!has(modals, id) && has(modals, wrongModalId)) {
			const { props: modalProps } = get(modals, wrongModalId, {} as ModalItem)
			const description = isString(modalProps?.description)
				? modalProps?.description.replace('%s', id)
				: modalProps?.description
			const [modal, props] = mergeProps(undefined, modalProps, (p) => ({ ...p, description }))
			return {
				id,
				key,
				resolver,
				map,
				modal,
				props,
			} as ModalActiveItem
		}
		const { props: modalProps, modal: customModal } = get(modals, id, {} as ModalItem)
		const [modal, props] = mergeProps(customModal, modalProps, override)
		return {
			id,
			key,
			resolver,
			map,
			modal,
			props,
		} as ModalActiveItem
	},
	target: setModal,
})

type ClosedAttachedParams = { params: OnCloseReturn<boolean, unknown> } & ModalActiveItem

const defaultMap: ReturnMap = (data) => data.result.value ?? false

const closedFx = domain.createEffect((data: ClosedAttachedParams) => {
	const {
		params: { result },
		id,
		resolver,
		props,
		map,
	} = data
	const resolve = { result, id, props }

	if (map === true) resolver?.(resolve)
	else if (isFunction(map)) resolver?.(map(resolve))
	else resolver?.(defaultMap(resolve))
})

// clear active modal state after close effect finishes
sample({
	clock: closedFx,
	target: resetModal,
})

export const closedModalFx = attach({
	effect: closedFx,
	source: $activeModal,
	mapParams: (params: OnCloseReturn<boolean, unknown>, active) => ({ params, ...active }),
})

// helpers ----------------------------------------------------------------------------------------]

function createPromise() {
	let resolver
	return [
		new Promise<ModalReturn>((resolve) => {
			resolver = resolve
		}),
		resolver as unknown as ModalResolver,
	] as const
}

export function registerModal<P = ExtraProps>(
	id: string,
	props: ModalProps | null,
	modal?: ModalComponent<P>,
) {
	addModal({
		id,
		props: props ?? undefined,
		modal: modal as ModalComponent,
	})
}

type ModalResult<T, L> = [unknown] extends [L] ? T : { value: T | null; linked: L }
type ResolveExtra<Extra> = [Extra] extends [null] ? ExtraProps : Extra

export function createModal<T = boolean, Extra = ExtraProps, L = unknown>(
	id: string,
	map?: ReturnMap<T, L> | null,
	withResetKey?: boolean,
) {
	return (override?: PropsOverride & ResolveExtra<Extra>) => {
		const key = withResetKey ? String(new Date().valueOf()) : undefined
		const [promise, resolver] = createPromise()
		gotModal({ id, key, resolver, override, map: map as ReturnMap })
		return promise as Promise<ModalResult<T, L>>
	}
}

export function createModalWithIds<Extra = ExtraProps>(id: string, defaultId = 'cancel') {
	return createModal<string, Extra>(id, (data) =>
		isString(data) ? data : data.result.value ? data.result.value : defaultId,
	)
}
