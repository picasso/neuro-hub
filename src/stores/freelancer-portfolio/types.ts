import type { PutBlobResult } from '@vercel/blob'

export type PortfolioForm = {
	title: string
	description: string
	category: string
	toolsUsed: string
	file: File | null
}

export type PortfolioItem = {
	id: string
	title: string
	description: string | null
	mediaUrl: string
	mediaType: string | null
	category: string | null
	toolsUsed: unknown
	createdAt: string | Date | null
	updatedAt: string | Date | null
}

export type UploadResult = PutBlobResult
