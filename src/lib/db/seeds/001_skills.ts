import type { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
	await knex('skills').del()

	await knex('skills').insert([
		{ name: 'GPT-4', category: 'text_generation' },
		{ name: 'GPT-4 Turbo', category: 'text_generation' },
		{ name: 'Claude 3.5 Sonnet', category: 'text_generation' },
		{ name: 'Claude 3 Opus', category: 'text_generation' },
		{ name: 'Gemini Pro', category: 'text_generation' },
		{ name: 'Jasper AI', category: 'text_generation' },
		{ name: 'Copy.ai', category: 'text_generation' },

		{ name: 'Midjourney', category: 'image_generation' },
		{ name: 'Stable Diffusion', category: 'image_generation' },
		{ name: 'DALL-E 3', category: 'image_generation' },
		{ name: 'DALL-E 2', category: 'image_generation' },
		{ name: 'Leonardo AI', category: 'image_generation' },
		{ name: 'Firefly (Adobe)', category: 'image_generation' },
		{ name: 'Ideogram', category: 'image_generation' },

		{ name: 'Runway Gen-3', category: 'video_generation' },
		{ name: 'Runway Gen-2', category: 'video_generation' },
		{ name: 'Pika Labs', category: 'video_generation' },
		{ name: 'Synthesia', category: 'video_generation' },
		{ name: 'D-ID', category: 'video_generation' },

		{ name: 'ElevenLabs', category: 'audio_generation' },
		{ name: 'Murf AI', category: 'audio_generation' },
		{ name: 'Suno AI', category: 'audio_generation' },
		{ name: 'Udio', category: 'audio_generation' },

		{ name: 'LangChain', category: 'programming' },
		{ name: 'OpenAI API', category: 'programming' },
		{ name: 'Anthropic API', category: 'programming' },
		{ name: 'Hugging Face', category: 'programming' },
		{ name: 'Vector Databases', category: 'programming' },
		{ name: 'RAG Systems', category: 'programming' },
		{ name: 'Fine-tuning', category: 'programming' },

		{ name: 'Prompt Engineering', category: 'consulting' },
		{ name: 'AI Strategy', category: 'consulting' },
		{ name: 'Team Training', category: 'consulting' },
	])
}
