import { nanoid } from 'nanoid'
import type { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
	await knex('skills').del()

	await knex('skills').insert([
		{ id: nanoid(), name: 'GPT-4', category: 'text_generation' },
		{ id: nanoid(), name: 'GPT-4 Turbo', category: 'text_generation' },
		{ id: nanoid(), name: 'Claude 3.5 Sonnet', category: 'text_generation' },
		{ id: nanoid(), name: 'Claude 3 Opus', category: 'text_generation' },
		{ id: nanoid(), name: 'Gemini Pro', category: 'text_generation' },
		{ id: nanoid(), name: 'Jasper AI', category: 'text_generation' },
		{ id: nanoid(), name: 'Copy.ai', category: 'text_generation' },

		{ id: nanoid(), name: 'Midjourney', category: 'image_generation' },
		{ id: nanoid(), name: 'Stable Diffusion', category: 'image_generation' },
		{ id: nanoid(), name: 'DALL-E 3', category: 'image_generation' },
		{ id: nanoid(), name: 'DALL-E 2', category: 'image_generation' },
		{ id: nanoid(), name: 'Leonardo AI', category: 'image_generation' },
		{ id: nanoid(), name: 'Firefly (Adobe)', category: 'image_generation' },
		{ id: nanoid(), name: 'Ideogram', category: 'image_generation' },

		{ id: nanoid(), name: 'Runway Gen-3', category: 'video_generation' },
		{ id: nanoid(), name: 'Runway Gen-2', category: 'video_generation' },
		{ id: nanoid(), name: 'Pika Labs', category: 'video_generation' },
		{ id: nanoid(), name: 'Synthesia', category: 'video_generation' },
		{ id: nanoid(), name: 'D-ID', category: 'video_generation' },

		{ id: nanoid(), name: 'ElevenLabs', category: 'audio_generation' },
		{ id: nanoid(), name: 'Murf AI', category: 'audio_generation' },
		{ id: nanoid(), name: 'Suno AI', category: 'audio_generation' },
		{ id: nanoid(), name: 'Udio', category: 'audio_generation' },

		{ id: nanoid(), name: 'LangChain', category: 'programming' },
		{ id: nanoid(), name: 'OpenAI API', category: 'programming' },
		{ id: nanoid(), name: 'Anthropic API', category: 'programming' },
		{ id: nanoid(), name: 'Hugging Face', category: 'programming' },
		{ id: nanoid(), name: 'Vector Databases', category: 'programming' },
		{ id: nanoid(), name: 'RAG Systems', category: 'programming' },
		{ id: nanoid(), name: 'Fine-tuning', category: 'programming' },

		{ id: nanoid(), name: 'Prompt Engineering', category: 'consulting' },
		{ id: nanoid(), name: 'AI Strategy', category: 'consulting' },
		{ id: nanoid(), name: 'Team Training', category: 'consulting' },
	])
}
