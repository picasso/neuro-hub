import type { Knex } from 'knex'

const SKILLS = [
	{ id: '00000000-0000-4000-8000-000000000001', name: 'GPT-4', category: 'text_generation' },
	{
		id: '00000000-0000-4000-8000-000000000002',
		name: 'GPT-4 Turbo',
		category: 'text_generation',
	},
	{
		id: '00000000-0000-4000-8000-000000000003',
		name: 'Claude 3.5 Sonnet',
		category: 'text_generation',
	},
	{
		id: '00000000-0000-4000-8000-000000000004',
		name: 'Claude 3 Opus',
		category: 'text_generation',
	},
	{ id: '00000000-0000-4000-8000-000000000005', name: 'Gemini Pro', category: 'text_generation' },
	{ id: '00000000-0000-4000-8000-000000000006', name: 'Jasper AI', category: 'text_generation' },
	{ id: '00000000-0000-4000-8000-000000000007', name: 'Copy.ai', category: 'text_generation' },

	{
		id: '00000000-0000-4000-8000-000000000101',
		name: 'Midjourney',
		category: 'image_generation',
	},
	{
		id: '00000000-0000-4000-8000-000000000102',
		name: 'Stable Diffusion',
		category: 'image_generation',
	},
	{ id: '00000000-0000-4000-8000-000000000103', name: 'DALL-E 3', category: 'image_generation' },
	{ id: '00000000-0000-4000-8000-000000000104', name: 'DALL-E 2', category: 'image_generation' },
	{
		id: '00000000-0000-4000-8000-000000000105',
		name: 'Leonardo AI',
		category: 'image_generation',
	},
	{
		id: '00000000-0000-4000-8000-000000000106',
		name: 'Firefly (Adobe)',
		category: 'image_generation',
	},
	{ id: '00000000-0000-4000-8000-000000000107', name: 'Ideogram', category: 'image_generation' },

	{
		id: '00000000-0000-4000-8000-000000000201',
		name: 'Runway Gen-3',
		category: 'video_generation',
	},
	{
		id: '00000000-0000-4000-8000-000000000202',
		name: 'Runway Gen-2',
		category: 'video_generation',
	},
	{ id: '00000000-0000-4000-8000-000000000203', name: 'Pika Labs', category: 'video_generation' },
	{ id: '00000000-0000-4000-8000-000000000204', name: 'Synthesia', category: 'video_generation' },
	{ id: '00000000-0000-4000-8000-000000000205', name: 'D-ID', category: 'video_generation' },

	{
		id: '00000000-0000-4000-8000-000000000301',
		name: 'ElevenLabs',
		category: 'audio_generation',
	},
	{ id: '00000000-0000-4000-8000-000000000302', name: 'Murf AI', category: 'audio_generation' },
	{ id: '00000000-0000-4000-8000-000000000303', name: 'Suno AI', category: 'audio_generation' },
	{ id: '00000000-0000-4000-8000-000000000304', name: 'Udio', category: 'audio_generation' },

	{ id: '00000000-0000-4000-8000-000000000401', name: 'LangChain', category: 'programming' },
	{ id: '00000000-0000-4000-8000-000000000402', name: 'OpenAI API', category: 'programming' },
	{ id: '00000000-0000-4000-8000-000000000403', name: 'Anthropic API', category: 'programming' },
	{ id: '00000000-0000-4000-8000-000000000404', name: 'Hugging Face', category: 'programming' },
	{
		id: '00000000-0000-4000-8000-000000000405',
		name: 'Vector Databases',
		category: 'programming',
	},
	{ id: '00000000-0000-4000-8000-000000000406', name: 'RAG Systems', category: 'programming' },
	{ id: '00000000-0000-4000-8000-000000000407', name: 'Fine-tuning', category: 'programming' },

	{
		id: '00000000-0000-4000-8000-000000000501',
		name: 'Prompt Engineering',
		category: 'consulting',
	},
	{ id: '00000000-0000-4000-8000-000000000502', name: 'AI Strategy', category: 'consulting' },
	{ id: '00000000-0000-4000-8000-000000000503', name: 'Team Training', category: 'consulting' },
] as const

export async function seed(knex: Knex): Promise<void> {
	// `skills` has unique on `id` and on `name`. Production may have legacy rows: same
	// `name` as the catalog but a different `id` (pre-UUID migration). A plain
	// `onConflict('id')` insert then hits `skills_name_unique`. Resolve by row lookup first.
	for (const row of SKILLS) {
		const byId = await knex('skills').where('id', row.id).first()
		if (byId) {
			await knex('skills')
				.where('id', row.id)
				.update({ name: row.name, category: row.category })
			continue
		}

		const byName = await knex('skills').where('name', row.name).first()
		if (byName) {
			await knex('skills').where('id', byName.id).update({ category: row.category })
			continue
		}

		await knex('skills').insert(row)
	}
}
