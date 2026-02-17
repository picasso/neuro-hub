import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { pictures } from '../index'

export const runtime = 'nodejs'

type RouteContext = {
	params: Promise<{ file: string }>
}

export async function GET(_: Request, context: RouteContext) {
	if (process.env.NODE_ENV !== 'development') {
		return new Response('Not found', { status: 404 })
	}

	const { file } = await context.params
	const picture = pictures.find((p) => p.file === file)
	if (!picture) return new Response('Not found', { status: 404 })

	const filePath = path.join(process.cwd(), 'src', 'app', 'playground', 'pictures', picture.file)
	const buffer = await readFile(filePath)

	return new Response(buffer, {
		headers: {
			'content-type': 'image/jpeg',
			'cache-control': 'no-store',
		},
	})
}
