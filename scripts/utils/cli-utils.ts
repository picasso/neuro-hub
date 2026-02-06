/* eslint-disable no-console */
import * as readline from 'readline'
import chalk from 'chalk'

export const printColors = {
	default: 'cyan',
	dim: 'gray',
	success: 'green',
	complete: 'green',
	info: 'blue',
	warning: 'yellow',
	error: 'red',
	errorParam: 'redBright',
} as const

type ColorName = (typeof printColors)[keyof typeof printColors]
type ColorStyle = keyof typeof printColors | { mod: string; color: keyof typeof printColors }

function getChalkColor(colorName: ColorName): (text: string) => string {
	switch (colorName) {
		case 'cyan':
			return chalk.cyan
		case 'gray':
			return chalk.gray
		case 'green':
			return chalk.green
		case 'blue':
			return chalk.blue
		case 'yellow':
			return chalk.yellow
		case 'red':
			return chalk.red
		case 'redBright':
			return chalk.redBright
		default:
			return chalk.cyan
	}
}

export function chalkColor(string: string, style?: ColorStyle): string {
	if (!style) {
		return getChalkColor(printColors.default)(string)
	}

	const isObject = typeof style === 'object' && style !== null
	const color = isObject ? style.color : style
	const colorName = printColors[color] || printColors.default

	return getChalkColor(colorName)(string)
}

export function print(
	message: string,
	color?: keyof typeof printColors,
	...values: unknown[]
): void {
	const chalkMessage = color ? chalkColor(message, color) : message

	if (values.length === 0) {
		console.log(chalkMessage)
	} else {
		console.log(chalkMessage, ...values)
	}
}

export function printWithPrefix(
	prefix: string,
	message: string,
	color?: keyof typeof printColors,
): void {
	const coloredPrefix = color ? chalkColor(prefix, color) : prefix
	const coloredMessage = color ? chalkColor(message, color) : message
	console.log(coloredPrefix, coloredMessage)
}

export function printSection(title: string): void {
	const lineWidth = 32
	const titleUpper = title.toUpperCase()
	const line = '━'.repeat(lineWidth)

	console.log(chalkColor(titleUpper, 'default'))
	console.log(chalkColor(line, 'default'))
}

export function printSuccess(message: string): void {
	printWithPrefix('✓', message, 'success')
}

export function printWarning(message: string): void {
	printWithPrefix('▲', message, 'warning')
}

export function printError(message: string): void {
	printWithPrefix('✖', message, 'error')
}

export function printInfo(message: string): void {
	printWithPrefix('◆', message, 'info')
}

export function printDataRow(fields: Array<[string, string | number | null]>): void {
	const parts = fields.map(([label, value]) => {
		const labelColored = chalk.gray(label + ':')
		const valueColored = chalk.blue.dim(String(value ?? 'null'))
		return labelColored + ' ' + valueColored
	})
	console.log('  • ' + parts.join(chalk.yellow.dim(' | ')))
}

export function printEmpty(): void {
	console.log('')
}

export function printListItem(text: string, indent = 0): void {
	const prefix = '  '.repeat(indent) + '• '
	console.log(prefix + chalk.blue.dim(text))
}

export function printText(text: string): void {
	console.log(text)
}

export function printUsage(lines: string[]): void {
	console.log(chalk.cyan.dim('Usage:'))
	lines.forEach((line) => {
		console.log(chalk.cyan.dim(line))
	})
}

export function pluralize(count: number, singular: string, withoutCount = false): string {
	const countLabel = withoutCount ? '' : count + ' '
	return countLabel + (count === 1 ? singular : singular + 's')
}

export async function promptConfirmation(message: string): Promise<boolean> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	return new Promise((resolve) => {
		const prompt = chalk.yellow(message + ' (yes/no): ')
		rl.question(prompt, (answer) => {
			rl.close()
			resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y')
		})
	})
}
