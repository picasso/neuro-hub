import { NextResponse } from 'next/server'
import { createSwaggerSpec } from 'next-swagger-doc'
import { swaggerConfig } from '@/lib/swagger/config'

export async function GET() {
	const spec = createSwaggerSpec({
		apiFolder: 'src/app/api',
		definition: swaggerConfig as never,
		schemaFolders: ['src/lib/validations', 'src/types'],
	})

	return NextResponse.json(spec)
}
