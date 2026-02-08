import { castArray, defaults, find, includes, isString, map, reduce } from 'lodash'

export type MarkdownParams = {
	links: string | string[] | null
	br: boolean
	nbsp: boolean
	externalLink: boolean
	raw: boolean
	json: boolean
	container: boolean
	nolinks: boolean
}

// converts a string to a set of React components based on simple Markdown constructs
// replaces **text** with <strong>text</strong>
// replaces *text* with <em>text</em>
// NOTE: Attention! Doesn't work for two blocks not separated by anything:
// *text1**text2* - doesn't work!  *text1* *text2* - works!
// replaces `text` with <span>text</span>
// NOTE: Attention! Doesn't work for two blocks not separated by anything:
// `text1``text2` - doesn't work!  `text1` `text2` - works!
// replaces [text](link) with <a href="link">text</a>
// replaces newlines with <p> or <br/> if 'params.br' is true
// also replaces $link<index> constructs with elements from the 'params.links' array

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function simpleMarkdown(str: any, params?: Partial<MarkdownParams>) {
	if (!isString(str)) return str

	const mod = defaults(params || {}, {
		links: null,
		br: false,
		nbsp: false,
		externalLink: true,
		raw: false,
		json: false,
		container: false,
		nolinks: false,
	})

	let linkReplace = '<a href="$2" target="_blank" rel="external noreferrer noopener">$1</a>'
	if (mod.externalLink)
		linkReplace = linkReplace.replace('<a', '<a class="components-external-link"')

	// replace links
	let md = reduce(
		castArray(mod.links || []),
		(msg, link, index) => msg.replace(`$link${index + 1}`, link),
		str,
	)
	// replace <span>
	md = md.replace(/(^|[^`])`([^`]+)`/gm, '$1<span class="__code">$2</span>')
	// replace color modifications
	// '!' - red, '#ff2020'
	// '?' - purple, '#cc0096'
	// '*' - green, '#1f993f'
	// '+' - blue, '#0070c9'
	// '#' - orange, '#a79635'
	md = md.replace(/__code">!/gm, '__code __e">')
	md = md.replace(/__code">\?/gm, '__code __q">')
	md = md.replace(/__code">\*/gm, '__code __s">')
	md = md.replace(/__code">\+/gm, '__code __i">')
	md = md.replace(/__code">#/gm, '__code __w">')
	// replace <strong>
	md = md.replace(/\*\*([^*]+)\*\*/gm, '<strong>$1</strong>')
	// replace <em>
	md = md.replace(/(^|[^*])\*([^*]+)\*/gm, '$1<em>$2</em>')
	// replace <a>
	if (mod.nolinks === false) md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/gm, linkReplace)

	// replace all spaces to '&nbsp;' if requested
	if (mod.nbsp) md = md.replace(/([ ])/gm, '&nbsp;')

	// add <p></p> or <br/> if '\n' are found
	if (includes(md, '\n') || (mod.json && includes(md, '\\n'))) {
		const regex = mod.json ? /\\n/gm : /\n/gm
		if (mod.br) md = md.replace(regex, '<br/>')
		else
			md = md
				.split(mod.json ? '\\n' : '\n')
				.map((line) => `<p>${line}</p>`)
				.join('')
	}

	// return earlier if 'raw' output requested or no tags are found
	if (mod.raw) return md
	if (md.match(/<[^<]+>/gm) === null) return str

	const body = string2dom(md)
	const markdown = <>{map(body?.childNodes, node2comp)}</>

	return mod.container ? <span className="__markdown">{markdown}</span> : markdown
}

function string2dom(str: string) {
	const el = document.createElement('html')
	el.innerHTML = str
	return find(el.childNodes, { nodeName: 'BODY' })
}

function node2comp(node: HTMLElement | HTMLAnchorElement, index: number) {
	const tag = String(node.nodeName).toLowerCase()
	const className = node.className ? node.className : undefined
	const text = node.textContent
	const anchor = node as HTMLAnchorElement

	if (tag === 'strong')
		return (
			<strong key={index} className={className}>
				{text}
			</strong>
		)
	if (tag === 'em')
		return (
			<em key={index} className={className}>
				{text}
			</em>
		)
	if (tag === 'span')
		return (
			<span key={index} className={className}>
				{text}
			</span>
		)
	if (tag === 'br') return <br key={index} />
	if (tag === '#text') return text
	if (tag === 'p')
		return (
			<p key={index} className={className}>
				{map(node.childNodes, node2comp)}
			</p>
		)
	if (tag === 'a')
		return (
			<a
				key={index}
				className={className}
				href={anchor.href}
				rel={anchor.rel}
				target={anchor.target}
			>
				{map(node.childNodes, node2comp)}
			</a>
		)
}

export const markdownCss = {
	'& br': {
		marginBottom: '2px',
	},
	'span.__code': {
		position: 'relative',
		padding: '1px 6px 2px',
		borderRadius: '6px',
		backgroundColor: 'rgba(0, 0, 0, 0.05)',
		letterSpacing: '0.5px',
		border: '1px solid var(--mui-palette-text-disabled)',
		'&.__e': {
			backgroundColor: 'var(--mui-palette-error-light)',
			color: 'var(--mui-palette-error-dark)',
			borderColor: 'var(--mui-palette-error-main)',
		},
		'&.__q': {
			backgroundColor: 'var(--mui-palette-secondary-light)',
			color: 'var(--mui-palette-secondary-dark)',
			borderColor: 'var(--mui-palette-secondary-main)',
		},
		'&.__s': {
			backgroundColor: 'var(--mui-palette-success-light)',
			color: 'var(--mui-palette-success-dark)',
			borderColor: 'var(--mui-palette-success-main)',
		},
		'&.__i': {
			backgroundColor: 'var(--mui-palette-info-light)',
			color: 'var(--mui-palette-info-dark)',
			borderColor: 'var(--mui-palette-info-main)',
		},
		'&.__w': {
			backgroundColor: 'var(--mui-palette-warning-light)',
			color: 'var(--mui-palette-warning-dark)',
			borderColor: 'var(--mui-palette-warning-main)',
		},
	},
}
