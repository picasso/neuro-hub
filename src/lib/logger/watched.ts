import { createDomain } from 'effector'
import { has, map } from 'lodash'
import {
	type ConfigLogger,
	createDomainWatched,
	list,
	listKey,
	listKeySome,
	namedItems,
	pl,
	size,
	uuid,
	watchedSettings,
} from './debug-effector'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any

// skip logger on `[empty]` stores
watchedSettings({ hideEmptyStores: true })

export const debugStores = {
	generic: true,
	meta: false,
	tasks: true,
}

// * * * generic watched domain -------------------------------------------------------------------]

export const genericDomain = createDomainWatched('neurogig', {}, debugStores.generic)

export const genericMuteDomain = createDomain('neurogig-muted')

// * * * $meta ------------------------------------------------------------------------------------]

const metaConfig: ConfigLogger = {
	colors: {
		$viewOptions: 'data',
		$meta: 'green',
		$layoutOptions: 'data',
		setDirty: 'red',
		savedMeta: 'green',
		updatedStatus: 'orange',
	},
	filter: {
		gate: true,
		$viewOptions: true,
		$layoutOptions: false,
		updatedViewOptions: false,
		createdMeta: false,
		savedMeta: true,
		updatedMeta: true,
		updatedStatus: true,
		getLayoutOptionsFx_root: false,
		saveTaskTypeFx_root: false,
		setDirty: false,
	},
	fn: {
		$meta: (meta: AnyType) => `${meta.id ? meta.name : 'empty'}`,
		$layoutOptions: (lo: AnyType) => `${lo?.containerArray ? 'data loaded' : 'empty'}`,
		updatedMeta: (update: AnyType) => list(update),
		updatedStatus: (update: AnyType) => list(update),
	},
}

export const metaDomain = createDomainWatched('task-type-meta', metaConfig, debugStores.meta)

// * * * task-edit --------------------------------------------------------------------------------]

const platemap = (ps: AnyType) => {
	return ps?.length
		? map(ps, (p: AnyType) => {
				const count = size(p?.containers)
				if (!count) return 'empty plate'
				return `${p?.name} <${pl('container', count)}>`
			}).join(', ')
		: 'empty'
}

const sets =
	(name = 'item', root = 'templateID') =>
	(slr: AnyType) => {
		const count = size(slr)
		if (!count) return 'empty'
		return `${pl(root, count)}: <${map(slr, namedItems(name)).join(', ')}>`
	}

const taskEditConfig: ConfigLogger = {
	colors: {
		$flow: 'fx',
		$lumaSelector: 'blue',
		$lumaSelectorBusy: 'blue',
		$plateSelector: 'blue',

		$meta: 'data',
		$lumaSelected: 'data',
		$lumaMaterials: 'data',
		$lumaOrigins: 'data',
		$template: 'data',
		$layout: 'data',
		$designed: 'data',
		$layoutIds: 'data',

		$values: 'orange',
		$target: 'orange',
		$history: 'orange',

		$plates: 'green',
		$source: 'green',

		setDirty: 'red',
		savedMeta: 'fx',
	},
	filter: {
		gate: true,
		setDirty: false,
		resetDirty: false,
		updatedFlow: false,
		$taskEditOptions: false,
		$lumaLoading: false,
		$lumaListHelpers: false,
		$managementOps: false,
		$rawdataRows: false,
		$rawdataColumns: false,
		$equationBuilder: false,
		$equations: false,

		$batchEnabled: false,
		$exportOptions: false,
		$allRegistered: false,

		'$viewOptions-tasks-edit': false,
		'resetViewOptions-tasks-edit': false,
		'updateViewOptions-tasks-edit': false,
		// loadLumaSelector: false,
		// loadPlateSelector: false,
		updateLoading: false,

		resetLumaSelector: false,
		resetLumaMaterials: false,
		resetLumaLoading: false,
		resetLumaSelected: false,
		resetListSource: false,
		resetPlateSelector: false,
		resetPlateSource: false,
		resetContainerSelected: false,
		resetSelectedItems: false,
		resetLinkedSelected: false,

		resetTemplate: false,
		resetValues: false,
		setupTarget: false,
		resultedPlates: false,
		finallyPlates: false,
		getLumaSelectorFx_root: false,
		getPlateSelectorFx_root: false,

		preloadSelectorsFx: false,
		getTaskFx_root: false,
		synHistoryValuesFx_root: false,
	},
	fn: {
		$meta: (meta: AnyType) => `${meta.id ? meta.name : 'empty'}`,
		$lumaSelector: sets('list', 'typeID'),
		$lumaSelectorBusy: (ls: AnyType) => listKeySome(ls, 'id', 'busy', true, 'free'),
		$lumaSelected: sets('listId'),
		$linkedSelected: sets('listId'),
		$plateSelector: sets('task', 'typeID'),
		$lumaOrigins: (lo: AnyType) => listKey(lo, 'listName'),
		$lumaMaterials: sets('material'),
		$listSource: sets('set', 'typeID'),
		$lumaLineage: sets('entity', 'material'),
		$flow: (flow: AnyType) => `${flow.step ?? 'unset'}`,

		$template: (t: AnyType) => `${size(t) ? pl('material', size(t)) : 'empty'}`,
		$layoutIds: (t: AnyType) => `${size(t) ? pl('ID', size(t)) : 'empty'}`,
		$designed: (d: AnyType) => `${d ? (d.listId ? uuid(d.listId) : 'unset') : 'empty'}`,
		$values: (val: AnyType) => listKey(val, 'name'),
		$history: (his: AnyType) => listKeySome(his, 'type', 'filled', false, 'not filled'),
		$target: (t: AnyType) => {
			const d = t.plates?.length && size(t.plates[0].containers) ? t.dimension : null
			return t.existing === undefined
				? 'empty'
				: `${t.existing ? 'existing' : 'create'}, ${d ? d[0] + 'x' + d[1] : 'empty'}`
		},
		$planned: (t: AnyType) => (has(t, 'name') ? t.name : 'unset'),

		$plates: platemap,
		$source: sets('plate'),
	},
}

export const taskEditDomain = createDomainWatched('task-edit', taskEditConfig, debugStores.tasks)
