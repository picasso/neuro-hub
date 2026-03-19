import { isTag, isText, type ChildNode } from 'domhandler'
import { parseDocument } from 'htmlparser2'
import {
	castArray,
	defaults,
	escapeRegExp,
	forEach,
	includes,
	isString,
	map,
	reduce,
	replace,
} from 'lodash'

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

// replace symbols with more readable ones
const pairs = [
	['->', '→'],
	['<-', '←'],
	['=>', '⇢'],
	['<=', '⬅︎'],
	['>>', '»'],
]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function simpleMarkdown(str: any, params?: Partial<MarkdownParams>) {
	if (!isString(str)) return str

	const mod = defaults({}, params ?? {}, {
		links: null,
		br: false,
		nbsp: false,
		externalLink: true,
		raw: false,
		json: false,
		container: false,
		nolinks: false,
		symbols: true,
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
	// replace symbols
	if (mod.symbols) {
		md = reduce(
			pairs,
			(s, [from, to]) => replace(s, new RegExp(escapeRegExp(from), 'g'), to),
			md,
		)
	}

	// replace `code`
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
		if (mod.br) md = md.replace(regex, '<br />')
		else
			md = md
				.split(mod.json ? '\\n' : '\n')
				.map((line) => `<p>${line}</p>`)
				.join('')
	}
	// return earlier if 'raw' output requested or no tags are found
	if (mod.raw) return md
	if (md.match(/<[^<]+>/gm) === null) return str

	const nodes = parseHtmlToNodes(md)
	const markdown = <>{map(nodes, node2jsx)}</>

	return mod.container ? <span className="__markdown">{markdown}</span> : markdown
}

// minimal node shape used for SSR and client so output is identical (no hydration mismatch)
export type ParsedNode = {
	tag: string
	className?: string
	textContent?: string
	children?: ParsedNode[]
	href?: string
	rel?: string
	target?: string
}

// parses HTML to a tree of `ParsedNode`
// works on server and client so SSR and client output match
function parseHtmlToNodes(html: string): ParsedNode[] {
	const doc = parseDocument(html)
	const nodes: ParsedNode[] = []
	forEach(doc.children, (node) => {
		const parsed = nodeToParsed(node)
		if (parsed) nodes.push(parsed)
	})
	return nodes
}

function nodeToParsed(node: ChildNode): ParsedNode | null {
	if (isText(node)) return { tag: '#text', textContent: node.data }
	if (isTag(node)) {
		const children = node.children.map(nodeToParsed).filter((n): n is ParsedNode => n !== null)
		return {
			tag: node.name.toLowerCase(),
			className: node.attribs?.class,
			children: children.length ? children : undefined,
			href: node.attribs?.href,
			rel: node.attribs?.rel,
			target: node.attribs?.target,
		}
	}
	return null
}

function getTextContent(p: ParsedNode): string {
	if (p.tag === '#text') return p.textContent ?? ''
	// `simpleMarkdown` doesn't support nested nodes,
	// so we just concat the text content of the `children`
	return map(p.children, getTextContent).join('')
}

function node2jsx(node: ParsedNode, index: number) {
	const { tag, className, children: childNodes, href, rel, target, textContent = '' } = node
	const text = getTextContent(node)

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
	if (tag === '#text') return textContent
	if (tag === 'p')
		return (
			<p key={index} className={className}>
				{map(childNodes, node2jsx)}
			</p>
		)
	if (tag === 'a')
		return (
			<a key={index} className={className} href={href} rel={rel} target={target}>
				{map(childNodes, node2jsx)}
			</a>
		)
	return null
}
