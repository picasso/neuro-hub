import _ from 'lodash'

// =================================================================================================
// Types & Enums
// =================================================================================================

export enum DevLogLevel {
	none = 0,
	short = 10,
	changes = 11,
	default = 20,
	normal = 21,
	verbose = 30,
	full = 31,
}

type DevGroupParams = {
	withoutNil?: boolean
	withoutIndex?: boolean
	resolveFuncData?: boolean
	arrayName?: string
}

type DataValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| Date
	| Error
	| Element
	| DataObject
	| DataArray
	| DataFunction
	| DataMap
	| DataSet

interface DataObject {
	[key: string]: DataValue
}

type DataArray = DataValue[]

type DataFunction = (...args: unknown[]) => unknown

type DataMap = Map<DataValue, DataValue>
type DataSet = Set<DataValue>

type DevData = DataObject | null | undefined
type DevDataFunc = () => DevData
type DevLazyData = DevData | DevDataFunc | DataArray

export type DevTools = {
	log: (message: DataValue, ...data: DataValue[]) => void
	logVerbose: (...data: DataValue[]) => void
	logGroup: (groupName: string, groupData?: DevLazyData | null, params?: DevGroupParams) => void
	logReducer: (
		name: string,
		mode: DataValue,
		action: DataValue,
		next: DevData,
		prev: DevData,
	) => void
	logGroupClose: () => void
	logDataWasNow: (data: DevData, prevData: DevData) => void
	logExpanded: (...data: DataValue[]) => void
	logLevel: (newLevel?: string) => number
	warn: (message: string, ...data: DataValue[]) => void
	error: (message: string, ...data: DataValue[]) => void
	onlyChanges: (
		next: DevData,
		prev: DevData,
		updated?: DevData,
		parentKey?: string,
		keys?: Record<string, string[]>,
	) => [DevData, Record<string, string[]>]

	testOnlyChanges: (next: DevData, prev: DevData) => void
	funcName: (prevFrames: number | string, asFuncGetter?: boolean) => string | null

	data: (data: DevLazyData, marker?: string) => void
	info: (message: string, ...data: DataValue[]) => void
}

// For full documentation on log levels, color modifiers, text markers, and API reference,
// see: ./DEBUG.md

const logMode = {
	none: 0,
	short: 10,
	changes: 11,
	default: 20,
	normal: 21,
	verbose: 30,
	full: 31,
} as const

type LogMode = (typeof logMode)[keyof typeof logMode]

type ConsoleFunc =
	| typeof console.log
	| typeof console.warn
	| typeof console.error
	| typeof console.info

type DebugConfig = {
	level: LogMode
	withoutCaller: boolean
	localDates: boolean
	simplify: boolean
	clone: boolean
	mods: {
		default: boolean
		ignoreNext: boolean
		func: false | ConsoleFunc
	}
	colors: {
		ok: boolean | OpaqueColor
		info: boolean
		data: boolean
		query: boolean
		opaque?: false | OpaqueColor
	}
	markers: {
		accented: string
		bold: string
		colored: string
		dim: string
		param: [string, string]
		opaque: [string, string]
		wan: [string, string]
	}
	timing: boolean
}

type OpaqueColor = {
	color: string
	bg: string
}

const config: DebugConfig = {
	level: logMode.default,
	withoutCaller: true,
	localDates: true,
	simplify: true,
	clone: false,
	mods: {
		default: false,
		ignoreNext: false,
		func: false,
	},
	colors: {
		ok: false,
		info: false,
		data: false,
		query: false,
	},
	markers: {
		accented: '±',
		bold: '§',
		colored: '~',
		dim: '‡',
		param: ['[', ']'],
		opaque: ['{', '}'],
		wan: ['«', '»'],
	},
	timing: false,
}

type MarkerShortcuts = {
	a: string
	b: string
	c: string
	d: string
	p: [string, string]
	o: [string, string]
	w: [string, string]
}

const _markers = _.transform(
	config.markers,
	(acc, value, key) => {
		const shortKey = key[0] as keyof MarkerShortcuts
		if (typeof value === 'string') {
			;(acc[shortKey] as string) = value
		} else {
			;(acc[shortKey] as [string, string]) = value
		}
	},
	{} as MarkerShortcuts,
)

const _accented = (s: string): string => `${_markers.a}${s}${_markers.a}`
const _bold = (s: string): string => `${_markers.b}${s}${_markers.b}`
const _colored = (s: string): string => `${_markers.c}${s}${_markers.c}`
const _dim = (s: string): string => `${_markers.d}${s}${_markers.d}`
const _param = (s: string, alt?: string): string =>
	`${_markers.p[0]}${s}${alt ? ' : ' : ''}${alt ?? ''}${_markers.p[1]}`
const _opaque = (s: string): string => `${_markers.o[0]}${s}${_markers.o[1]}`
const _wan = (s: string): string => `${_markers.w[0]}${s}${_markers.w[1]}`

type DebugColors = {
	basic: string
	name: string
	alert: string
	query: string
	ok: string
	info: string
	info2: string
	data: string
	white: string
	black: string
	accent: string
	accentBg: string
	colored: string
	coloredBg: string
	dim: number
	wan: number
	cyan: string
	green: string
	gray: string
}

const dcolors: DebugColors = {
	basic: '#a79635',
	name: '#e56a17',

	alert: '#ff2020',
	query: '#cc0096',
	ok: '#1f993f',
	info: '#0070c9',
	info2: '#0070c9',
	data: '#a79635',

	white: '#ffffff',
	black: '#111111',
	accent: '#cb5e14',
	accentBg: '#fff7e5',
	colored: '#0f5d9a',
	coloredBg: '#ecffe5',
	dim: 0.6,
	wan: 0.6,
	cyan: '#00D1D4',
	green: '#00A862',
	gray: '#8F92A3',
}

const modRegex = /^[!|?|*|+|#|^|@|&|%|$|∞|>]/

const mods = {
	alert: '!',
	query: '?',
	ok: '*',
	info: '+',
	info2: '@',
	data: '#',
	cyan: '&',
	green: '%',
	name: '$',
	gray: '∞',
} as const

type ModKey = keyof typeof mods
const arrowSymbol: string = ' ' + _colored('⇢') + ' '
const chevronSymbol: string = ' ' + _bold('»') + ' '
const compactKeysCount = 6

// =================================================================================================
// Configuration Management
// =================================================================================================

function logLevel(newLevel = ''): number {
	if (newLevel) {
		const levelKey = newLevel as keyof typeof logMode
		config.level = _.has(logMode, newLevel) ? logMode[levelKey] : config.level
	}
	return config.level
}

function logNames(level: LogMode | string): string[] {
	if (_.isString(level)) return [level]
	const names = _.reduce(
		logMode,
		(acc: string[], val, name) => {
			if (val === level) acc.push(name)
			return acc
		},
		[],
	)
	return _.isEmpty(names) ? ['none'] : names
}

// =================================================================================================
// Color Formatting & Markers
// =================================================================================================

function resetAllModifiers(): void {
	config.colors = _.mapValues(config.colors, () => false) as typeof config.colors
	config.mods = _.mapValues(config.mods, () => false) as typeof config.mods
}

function stripColorModifiers(string: string, returnMod = false): string {
	const str = _.trimStart(string, '-')
	return returnMod ? (modRegex.test(str) ? str[0] : '') : str.replace(modRegex, '')
}

type ColorByResult = string | [string, boolean, OpaqueColor | null]

function colorBy(message: string): ColorByResult {
	const foundColorKey = _.findKey(config.colors, (v) => v !== false) as
		| keyof DebugColors
		| undefined
	const color = foundColorKey
		? dcolors[foundColorKey]
		: config.mods.default
			? dcolors.black
			: dcolors.basic
	const mod = stripColorModifiers(message, true)
	if (mod) {
		const modKey = _.findKey(mods, (v) => v === mod) as ModKey | undefined
		const modColor = modKey ? dcolors[modKey] : dcolors.basic
		if (mod === '^') config.colors.opaque = { color: dcolors.white, bg: dcolors.cyan }
		return mod === '^'
			? [color as string, true, null]
			: [modColor, true, { color: dcolors.white, bg: modColor }]
	}
	return color as string
}

type ColorStyles = {
	normal: string
	accent: string
	bold: string
	params: string
	colored: string
	opaque: string
	dim: string
	wan: string
}

function getColors(main: ColorByResult = dcolors.basic): ColorStyles {
	const [mainColor, mainBold, mainOpaque] = _.isArray(main)
		? main
		: [main, false, { color: dcolors.white, bg: main }]
	const weightBold = 'font-weight: bold;'
	const weightRegular = 'font-weight: normal;'
	const weightNormal = mainBold ? weightBold : weightRegular
	const padding = 'padding: 0 2px 0 2px;'
	const paddingBg = 'padding: 1px 3px 1px 3px;'
	const rounded = 'border-radius: 3px;'
	const configOpaque = config.colors.opaque
	const fallbackOpaque: OpaqueColor = { color: dcolors.white, bg: dcolors.alert }
	const opaque: OpaqueColor =
		mainOpaque ??
		(configOpaque && typeof configOpaque !== 'boolean' ? configOpaque : fallbackOpaque)
	const mainRgb = hexToRgb(mainColor)
	const dimColor = mainRgb
		? `rgba(${mainRgb.r},${mainRgb.g},${mainRgb.b},${dcolors.dim})`
		: mainColor
	const wanColor = mainRgb
		? `rgba(${mainRgb.r},${mainRgb.g},${mainRgb.b},${dcolors.wan})`
		: mainColor
	return {
		normal: `${weightNormal} color: ${mainColor}`,
		accent: `${weightBold} ${paddingBg} ${rounded} color: ${dcolors.accent}; background: ${dcolors.accentBg}`,
		bold: `${weightBold} color: ${mainColor}`,
		params: `${weightBold} ${padding} color: ${dcolors.name}`,
		colored: `${weightBold} ${paddingBg} ${rounded} color: ${dcolors.colored}; background: ${dcolors.coloredBg}`,
		opaque: `${weightBold} ${paddingBg} ${rounded} color: ${opaque.color}; background: ${opaque.bg}`,
		dim: `${weightRegular} ${padding} ${rounded} color: ${dimColor}`,
		wan: `${weightBold} ${paddingBg} ${rounded} color: ${opaque.color}; background: ${wanColor}`,
	}
}

const tokenFormat = (t: string): string => `${t}%c`

type ParseResult = {
	format: string
	items: string[]
}

function parseWithColors(message: string, colors?: ColorStyles): ParseResult {
	const { normal, bold, params, accent, colored, opaque, dim, wan } = colors ?? getColors()
	const { a, b, c, d, p, o, w } = _markers
	let isComplete = true
	let format = '%c'
	const items: string[] = [normal]
	let token: string | number = ''
	_.forEach(message, (char, index) => {
		if (token === -1) {
			token = ''
		} else {
			if (char === a) {
				if (isComplete) {
					format += tokenFormat(String(token))
					items.push(accent)
					token = ''
					isComplete = false
				} else {
					format += tokenFormat(String(token))
					items.push(normal)
					token = ''
					isComplete = true
				}
			} else if (char === c) {
				if (isComplete) {
					format += tokenFormat(String(token))
					items.push(colored)
					token = ''
					isComplete = false
				} else {
					format += tokenFormat(String(token))
					items.push(normal)
					token = ''
					isComplete = true
				}
			} else if (char === b) {
				if (isComplete) {
					format += tokenFormat(String(token))
					items.push(bold)
					token = ''
					isComplete = false
				} else {
					format += tokenFormat(String(token))
					items.push(normal)
					token = ''
					isComplete = true
				}
			} else if (char === d) {
				if (isComplete) {
					format += tokenFormat(String(token))
					items.push(dim)
					token = ''
					isComplete = false
				} else {
					format += tokenFormat(String(token))
					items.push(normal)
					token = ''
					isComplete = true
				}
			} else if (char === p[0]) {
				format += tokenFormat(String(token) + p[0])
				items.push(params)
				token = ''
			} else if (char === p[1]) {
				format += tokenFormat(String(token))
				items.push(normal)
				token = p[1]
			} else if (char === o[0]) {
				format += tokenFormat(String(token))
				const coloredOpaque = stripColorModifiers(message[index + 1], true)
				if (coloredOpaque) {
					const { opaque: opaqueColor } = getColors(colorBy(message[index + 1]))
					items.push(opaqueColor)
					token = -1
				} else {
					items.push(opaque)
					token = ''
				}
			} else if (char === o[1]) {
				format += tokenFormat(String(token))
				items.push(normal)
				token = ''
			} else if (char === w[0]) {
				format += tokenFormat(String(token))
				items.push(wan)
				token = ''
			} else if (char === w[1]) {
				format += tokenFormat(String(token))
				items.push(normal)
				token = ''
			} else {
				token += char
			}
		}
	})
	format += String(token)
	return { format, items }
}

/* eslint-disable no-console */
function logWithColors(message: string, ...data: DataValue[]): void {
	const colored = !config.mods.default
	let func: ConsoleFunc = config.colors.info && colored ? console.info : console.log
	if (config.mods.func) func = config.mods.func
	let processedMessage = message.replace(/{->}/g, arrowSymbol).replace(/{>>}/g, chevronSymbol)
	if (processedMessage.startsWith('>')) {
		processedMessage = processedMessage.replace(/^>/, '')
		func = console.groupCollapsed
	}

	const colors = getColors(colorBy(processedMessage))
	const parsed = parseWithColors(stripColorModifiers(processedMessage), colors)
	let format = parsed.format
	const items = parsed.items
	if (!_.isEmpty(data)) format = format + '  '

	_.forEach(data, (item) => {
		const value: DataValue = _.isFunction(item) ? ((item as DataFunction)() as DataValue) : item
		if (_.isString(value) && colored) {
			const { format: newFormat, items: newItems } = parseWithColors(value, colors)
			format = format + newFormat
			items.push(...newItems)
		} else {
			format = format + (_.isString(value) ? '%s' : '%o')
			const processedValue = config.clone
				? cloneValue(value)
				: config.localDates && _.isDate(value)
					? value.toLocaleString()
					: value
			items.push(processedValue as string)
		}
	})

	func(format, ...items)
	resetAllModifiers()
}

// =================================================================================================
// Data Analysis & Type Checking
// =================================================================================================

function isSimpleType(val: DataValue): boolean {
	return _.isNil(val) || _.isBoolean(val) || _.isString(val) || _.isNumber(val) || _.isDate(val)
}

function isCompactType(val: DataValue): boolean {
	return isSimpleType(val) || (_.isObject(val) && _.keys(val).length < compactKeysCount)
}

function cloneValue(value: DataValue): DataValue {
	if (_.isNil(value)) return value
	const nodeCloner = (val: DataValue): Element | undefined =>
		_.isElement(val) ? ((val as Element).cloneNode(true) as Element) : undefined
	const cloned = _.cloneDeepWith(value, nodeCloner)
	if (!_.isEmpty(cloned)) return cloned as DataValue
	const seen = new WeakSet<object>()
	const circularReplacer = (_key: string, val: unknown): DataValue | string | undefined => {
		if (typeof val === 'object' && val !== null) {
			if (seen.has(val)) return undefined
			seen.add(val)
		}
		return _.isUndefined(val) ? '__undefined' : (val as DataValue)
	}
	return JSON.parse(JSON.stringify(value, circularReplacer)) as DataValue
}

type CheckFunction = (val: DataValue) => boolean

function anyOf(v1: DataValue, v2: DataValue, func: CheckFunction | CheckFunction[]): boolean {
	const functions = _.castArray(func)
	for (const f of functions) {
		if (f(v1) || f(v2)) return true
	}
	return false
}

function fixValue(value: DataValue, key: string, set: DevData): DataValue | string | undefined {
	if (value === '') return '""'
	if (_.isFunction(value)) return tryFuncName(value as DataFunction)
	if (set) {
		const setObj = set as DataObject
		if (setObj[key] && _.isArray(setObj[key])) {
			const compacted = _.compact(value as DataArray)
			return compacted.length === 1 ? compacted[0] : compacted.length ? compacted : undefined
		}
	}
	return value
}

function tryFuncName(value: DataFunction | DataValue): string {
	const matches = String(value).match(/\s([\w|_]+[^(]+).*$/ms)
	return matches ? `{^function} ${matches[1]}()` : '{^function()}'
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
			}
		: null
}

// =================================================================================================
// Change Tracking & Comparison
// =================================================================================================

type ChangedKeysResult = [string[], string[] | null, string[] | null] | string[]

function changedKeys(next: DevData, prev: DevData, allKeys = false): ChangedKeysResult {
	const updated: string[] = []
	_.forEach(next, (val, key) => {
		if (prev && prev[key] !== val) {
			updated.push(key)
		}
	})
	const nextKeys = _.keys(next)
	const prevKeys = _.keys(prev)
	const added = _.difference(nextKeys, prevKeys)
	const removed = _.difference(prevKeys, nextKeys)
	if (allKeys) return _.concat(updated, removed)
	return [
		_.difference(updated, added),
		_.isEmpty(added) ? null : added,
		_.isEmpty(removed) ? null : removed,
	]
}

function logAddedRemoved(
	added: string[] | null,
	removed: string[] | null,
	name: string | null = null,
): void {
	const addedKeys = added ? (added.length > 1 ? 'keys' : 'key') : false
	const removedKeys = removed ? (removed.length > 1 ? 'keys' : 'key') : false
	let message = addedKeys || removedKeys ? chevronSymbol : ''
	if (addedKeys && added) {
		const keys =
			added.length > compactKeysCount
				? _.concat(_.take(added, compactKeysCount), ['and more...'])
				: added
		message += `added ${_bold(addedKeys)} ${_param(_.join(keys, ', '))}${removedKeys ? ', ' : ''}`
	}
	if (removedKeys && removed) {
		const keys =
			removed.length > compactKeysCount
				? _.concat(_.take(removed, compactKeysCount), ['and more...'])
				: removed
		message += `removed ${_bold(removedKeys)} ${_param(_.join(keys, ', '))}`
	}
	if (message) logAsOneString(name ? `${name} ${message}` : message)
}

function logWasNow(was: DevData, now: DevData, keys: string[]): void {
	const firstKey = _.first(keys) ?? ''
	const wasValue = keys.length === 1 && was ? was[firstKey] : was
	const nowValue = keys.length === 1 && now ? now[firstKey] : now
	let updated: string[] = []
	let added: string[] | null = null
	let removed: string[] | null = null

	if (keys.length === 1 && wasValue && nowValue) {
		const changedResult = changedKeys(nowValue as DevData, wasValue as DevData) as [
			string[],
			string[] | null,
			string[] | null,
		]
		if (Array.isArray(changedResult) && changedResult.length === 3) {
			;[updated, added, removed] = changedResult
		}
	}

	const changed: false | string[] = keys.length === 1 ? updated : false

	logAddedRemoved(added, removed)
	if (Array.isArray(changed) && changed.length === 1) {
		const firstChanged = _.first(changed) ?? ''
		const message = `${chevronSymbol}changed for ${_bold('key')} ${_param(firstChanged)}`
		const nowObj = nowValue as DataObject
		const wasObj = wasValue as DataObject
		if (isSimpleType(nowObj[firstChanged])) {
			logAsOneString(message, wasObj[firstChanged], arrowSymbol, nowObj[firstChanged])
		} else {
			logAsOneString(message)
			logWasNow(wasObj, nowObj, changed)
		}
	} else {
		logAsOneString(`${_colored('was')}`)
		logExpanded(wasValue)
		const changedStr: string[] = Array.isArray(changed) ? changed : []
		logAsOneString(
			changedStr.length > 0
				? `${_colored('now')} changed for ${_bold('keys')} ${_param(_.join(changedStr, ', '))}`
				: `${_colored('now')}`,
		)
		logExpanded(nowValue)
		if (_.isEqual(wasValue, nowValue)) {
			logAsOneString(`{!Attention} ${_bold('they are equal!')}`)
		}
	}
}

function logChanges(
	keys: [string[], string[] | null, string[] | null],
	prevValues: DevData,
	values: DevData,
): void {
	const [updated, added, removed] = keys
	logAddedRemoved(added, removed)
	if (updated.length === 0) logWasNow(prevValues, values, updated)
	_.forEach(updated, (key) => {
		if (!values) return
		const value = values[key]
		config.colors.ok = true
		const message = `${chevronSymbol}${_accented(key)}`
		if (isSimpleType(value)) {
			const prevValue = prevValues ? prevValues[key] : undefined
			logAsOneString(message, prevValue, arrowSymbol, value)
		} else {
			if (_.isFunction(value)) {
				logAsOneString([message, `${_param('function')}`])
			} else {
				const prevValue = prevValues ? prevValues[key] : undefined
				const changedResult = changedKeys(value as DevData, prevValue as DevData) as [
					string[],
					string[] | null,
					string[] | null,
				]
				const [changed, addedKeys, removedKeys] = changedResult
				logAddedRemoved(addedKeys, removedKeys, changed.length ? null : message)
				if (changed.length) {
					const firstKey = _.first(changed) ?? ''
					if (!changed.length && !addedKeys?.length && !removedKeys?.length) {
						logAsOneString(
							`${message} ${arrowSymbol} changed itself but the keys unchanged {something is wrong!}`,
						)
						logWasNow(prevValue as DevData, value as DevData, changed)
					} else {
						const keyMsg = `${message} @1 ${_bold('@2')} ${_param(_.join(changed, ', '))}`
						if (_.isArray(value)) {
							const arrayMsg = keyMsg
								.replace('@2', changed.length === 1 ? 'index' : 'indexes')
								.replace('@1', 'at')
							const prevArray = prevValue as DataArray
							if (changed.length === 1 && isSimpleType(value[Number(firstKey)])) {
								logAsOneString(
									arrayMsg,
									prevArray[Number(firstKey)],
									arrowSymbol,
									value[Number(firstKey)],
								)
							} else {
								logAsOneString(arrayMsg)
								logWasNow(
									prevValue as unknown as DevData,
									value as unknown as DevData,
									changed,
								)
							}
						} else {
							const valueObj = value as DataObject
							if (_.has(valueObj, '$$typeof')) {
								logAsOneString([message, `${_param('React Component')}`])
							} else {
								const objMsg = keyMsg
									.replace('@2', changed.length === 1 ? 'key' : 'keys')
									.replace('@1', 'for')
								const prevObj = prevValue as DataObject
								if (changed.length === 1 && isSimpleType(valueObj[firstKey])) {
									logAsOneString(
										objMsg,
										prevObj[firstKey],
										arrowSymbol,
										valueObj[firstKey],
									)
								} else {
									logAsOneString(objMsg)
									logWasNow(
										_.pick(prevObj, changed) as DevData,
										_.pick(valueObj, changed) as DevData,
										changed,
									)
								}
							}
						}
					}
				} else if (addedKeys?.length || removedKeys?.length) {
					logWasNow(
						prevValue as DevData,
						value as DevData,
						_.concat(addedKeys ?? [], removedKeys ?? []),
					)
				}
			}
		}
	})
}

// =================================================================================================
// Stack Trace Utilities
// =================================================================================================

function skipFrames(name: string | string[], prev: number | string | string[]): number {
	const frames = _.isArray(name) ? name.length : _.split(name, ',').length
	const prevFrames = _.isNumber(prev)
		? prev
		: _.isArray(prev)
			? prev.length
			: _.split(prev, ',').length
	return prevFrames + frames
}

function componentName(prevFrames: number | string = 0, asFuncGetter = false): string | null {
	if (!asFuncGetter && config.withoutCaller) return null
	const [name] = findOnStack(skipFrames('componentName', prevFrames))
	if (asFuncGetter) return name
	if (name[0] === name[0].toUpperCase()) return name
	const func = name.replace('/zu_blocks', '').replace(/[/]/g, '.')
	return `${func}()`
}

function findOnStack(prevFrames: number): [string, string] {
	const removeFrames = skipFrames('findOnStack', prevFrames)
	const stack = _.slice(_.split(new Error().stack, '\n'), removeFrames, removeFrames + 2)
	return [funcFromStack(stack, 0), funcFromStack(stack, 1)]
}

function funcFromStack(frames: string[], index = 0): string {
	return (_.get(_.split(frames[index], '@'), 0, '?') || '?').replace(/[<|/]+$/g, '')
}

function caller(name: string | null, localMod = true): string {
	return name && localMod ? `${_bold(name)}` : ''
}

// =================================================================================================
// Core Logging Functions (Public API)
// =================================================================================================

function log(message: DataValue, ...data: DataValue[]): void {
	const loglevel = logLevel()
	if (loglevel === 0) return

	if (_.isString(message)) {
		config.mods.default = true
		logWithColors(message, ...data)
	} else {
		console.log(message, ...data)
	}
}

function logVerbose(...data: DataValue[]): void {
	if (logLevel() > 21) {
		const [first, ...rest] = data
		log(first, ...rest)
	}
}

function logAsOneString(chunks: string | string[], ...data: DataValue[]): void {
	let message = _.isArray(chunks) ? _.join(chunks, ' ') : String(chunks)
	message = message.replace(/\s+/g, ' ').replace(/\s*\]/g, ']').replace(/\[\s*/g, '[')
	logWithColors(message, ...data)
}

function logGroup(
	groupName: string,
	groupData?: DevLazyData | null,
	params?: DevGroupParams,
): void {
	let shouldCloseGroup = true
	if (!groupName.startsWith('<')) {
		const {
			withoutNil = false,
			withoutIndex = false,
			arrayName = groupName,
			resolveFuncData = false,
		} = params ?? {}
		if (groupName.startsWith('-') || groupName.startsWith('+')) {
			const func = groupName.startsWith('+') ? _accented : _dim
			const dataArray: DataValue[] = _.isArray(groupData) ? groupData : [groupData]
			logWithColors(`^${func(groupName.replace(/^[-|+]/, ''))} ${arrowSymbol} `, ...dataArray)
			shouldCloseGroup = false
		} else {
			logWithColors(`>${groupName}`)
			if (_.isNil(groupData)) shouldCloseGroup = false
			let processedGroupData = groupData
			if (resolveFuncData && _.isFunction(groupData)) processedGroupData = groupData()
			const groupConfig = {
				withoutNil,
				withoutIndex,
				arrayName,
				groupName,
				groupData: processedGroupData,
			}

			if (_.isMap(processedGroupData)) {
				;(processedGroupData as DataMap).forEach((value: DataValue, key: DataValue) =>
					doGroupItem(value, String(key), groupConfig),
				)
			} else if (_.isSet(processedGroupData)) {
				;(processedGroupData as DataSet).forEach((value: DataValue) =>
					doGroupItem(value, String(value), groupConfig),
				)
			} else {
				_.forEach(processedGroupData, (value, key) =>
					doGroupItem(value, String(key), groupConfig),
				)
			}
		}
	}
	if (shouldCloseGroup) console.groupEnd()
	resetAllModifiers()
}

type GroupItemConfig = {
	withoutNil: boolean
	withoutIndex: boolean
	arrayName: string
	groupName: string
	groupData: DevLazyData | null
}

function doGroupItem(value: DataValue, key: string | number, config: GroupItemConfig): void {
	const { withoutNil, withoutIndex, arrayName, groupName, groupData } = config
	if (!(withoutNil && _.isNil(value))) {
		const indexName = withoutIndex ? '' : `[${key}]`
		const keyName = groupName && _.isArray(groupData) ? `${arrayName}${indexName}` : String(key)
		if (_.isFunction(value)) {
			console.dir(value)
		} else logWithColors(`^${_accented(keyName)}${arrowSymbol}`, value)
	}
}

function logReducer(
	name: string,
	mode: DataValue,
	action: DataValue,
	next: DevData,
	prev: DevData,
): void {
	const devMode = logNames(mode as LogMode | string)
	if (_.includes(devMode, 'none')) return

	const hasChanged = !_.isEqual(prev, next)
	const data = _.includes(devMode, 'changes')
		? null
		: {
				action,
				prev,
				state: hasChanged ? next : '=prev',
			}

	const actionType =
		action && typeof action === 'object' && 'type' in action ? action.type : String(action)
	logGroup(
		`?${name} [${actionType}] - {${hasChanged ? '*effective change' : '#same as the previous'}}`,
		data,
	)
	if (_.includes(devMode, 'changes')) {
		if (!hasChanged) {
			logGroup('+action', [action])
			logGroup('+current state', [prev])
		} else {
			const [updated, updatedKeys] = onlyChanges(next, prev ?? {})
			const updatedObj = updated as DataObject
			const nval = (updatedObj?.next as DataObject) ?? {}
			const pval = (updatedObj?.prev as DataObject) ?? {}
			const updatedProps = _.uniq(_.concat(_.keys(nval), _.keys(pval)))
			logGroup('+updated keys', [`[${updatedProps.join(', ')}]`])
			_.forEach(updatedProps, (prop) => {
				const subkeys = updatedKeys[prop] ?? null
				logGroup(`+${prop}`, [
					subkeys ? `changes for [${subkeys.join(', ')}]:` : 'value:',
					'  {* now }  ',
					fixValue(nval[prop], prop, next),
					'  {! was }  ',
					fixValue(pval[prop], prop, prev),
				])
			})
		}
		logGroupClose()
	}
}

function logGroupClose(): void {
	logGroup('<')
}

function logExpanded(...data: DataValue[]): void {
	console.dir(...data)
}

function warn(message: string, ...data: DataValue[]): void {
	if (logLevel() === 0) return

	if (message) {
		config.mods.default = true
		config.mods.func = console.warn
		logWithColors(message, ...data)
	} else {
		console.trace()
	}
}

function error(message: string, ...data: DataValue[]): void {
	if (config.mods.ignoreNext) return
	config.mods.default = true
	config.mods.func = console.error
	logWithColors(`!${message}`)
	if (!_.isEmpty(data)) {
		log('-!{Error data}', ...data)
	}
}

/* eslint-enable no-console */

// =================================================================================================
// Component Debugging Helpers
// =================================================================================================

function dataInComponent(data: DevLazyData, marker = ''): void {
	let processedData = data
	if (_.isFunction(data)) processedData = data()
	const cname = componentName('dataInComponent')
	const keys = _.keys(processedData)
	const isSingleKey = keys.length === 1
	const key = isSingleKey ? (_.first(keys) ?? '') : _.join(_.map(keys, _accented), ', ')
	const dataObj = processedData as DataObject
	const value = isSingleKey && dataObj ? dataObj[key] : processedData
	const withName = !_.startsWith(marker, '-')
	const altName =
		!!stripColorModifiers(marker) && marker ? `:${_colored(stripColorModifiers(marker))}` : ''
	const message = `${caller(cname, withName)}${altName} ${arrowSymbol} value for ${
		isSingleKey ? _accented(key) : key
	}`
	config.colors.data = true
	if (isSimpleType(value)) {
		logAsOneString(message, value)
	} else {
		logAsOneString(message)
		logExpanded(value)
	}
}

function infoInComponent(message: string, ...data: DataValue[]): void {
	const colorMod = stripColorModifiers(message, true)
	const cname = componentName('infoInComponent')
	const withName = _.startsWith(message, '-') ? false : cname !== '?'
	const spacer = withName ? ` ${arrowSymbol} ` : ''
	const info = `${colorMod}${caller(cname, withName)}${spacer}${stripColorModifiers(message)}`
	config.colors.info = true
	if (data.length === 0 || (data.length === 1 && isCompactType(data[0]))) {
		logAsOneString(info, ...data)
	} else {
		logAsOneString(info)
		logExpanded(...data)
	}
}

function logDataWasNow(data: DevData, prevData: DevData): void {
	const dataKeys = changedKeys(data, prevData) as [string[], string[] | null, string[] | null]
	logChanges(dataKeys, prevData, data)
}

// =================================================================================================
// Advanced Change Detection
// =================================================================================================

function onlyChanges(
	next: DevData,
	prev: DevData,
	updated?: DevData,
	parentKey = '',
	keys: Record<string, string[]> = {},
): [DevData, Record<string, string[]>] {
	let processedUpdated: DataObject = (updated as DataObject) ?? { next: {}, prev: {} }
	let processedNext: DevData | DataArray = next
	let processedKeys = keys
	const isIndex = _.isArray(next)
	const updatedKeys: (string | number)[] = []
	const removedKeys = _.difference(_.keys(prev), _.keys(next))
	if (removedKeys.length) {
		if (isIndex) {
			processedNext = _.map(prev as unknown as DataArray, (item, i) =>
				_.includes(removedKeys, String(i)) ? undefined : item,
			)
		} else {
			processedNext = _.transform(
				removedKeys,
				(acc, key) => {
					acc[key] = undefined
				},
				{ ...(prev as DataObject) },
			)
		}
	}
	_.forEach(processedNext as DataObject, (val: DataValue, key: string) => {
		const prevObj = prev as DataObject
		const prevValue = prevObj?.[key]
		const updateKey = parentKey ? parentKey + (isIndex ? `[${key}]` : `.${key}`) : String(key)
		if (prevValue !== val) {
			if (anyOf(val, prevValue, [_.isUndefined, isSimpleType, _.isFunction])) {
				if (!_.includes(removedKeys, String(key)))
					_.set(processedUpdated, `next.${updateKey}`, val)
				_.set(processedUpdated, `prev.${updateKey}`, prevValue)
				if (!_.includes(updatedKeys, key)) updatedKeys.push(key)
			} else {
				const [newUpdated, newKeys] = onlyChanges(
					val as DevData,
					prevValue as DevData,
					processedUpdated as DevData,
					updateKey,
					processedKeys,
				)
				processedUpdated = newUpdated as DataObject
				processedKeys = newKeys
			}
		}
	})
	if (!_.isEmpty(updatedKeys)) {
		const matches = /^([^[|.]+)/.exec(parentKey)
		if (matches) {
			_.set(
				processedKeys,
				matches[1],
				_.union(updatedKeys.map(String), _.get(processedKeys, matches[1], [])),
			)
		} else {
			_.set(processedKeys, 'root', updatedKeys.map(String))
		}
	}
	return [processedUpdated as DevData, processedKeys]
}

function testOnlyChanges(next: DevData, prev: DevData): void {
	const [updated, keys] = onlyChanges(next, prev)
	const nextData = updated?.next
	logExpanded(nextData)
	logExpanded(keys)
}

// =================================================================================================
// Public API Export
// =================================================================================================

const devHelpers: DevTools = {
	log,
	logVerbose,
	logGroup,
	logReducer,
	logGroupClose,
	logDataWasNow,
	logExpanded,
	logLevel,
	warn,
	error,
	onlyChanges,
	testOnlyChanges,
	funcName: componentName,

	data: dataInComponent,
	info: infoInComponent,
}

export default devHelpers

const markers: Record<string, (s: string, alt?: string) => string> = {
	_accented,
	_bold,
	_colored,
	_dim,
	_param,
	_opaque,
	_wan,
}
export { logNames, isSimpleType, markers }
