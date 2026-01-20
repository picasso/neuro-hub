import type { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
	await knex('user_skills').del()
	await knex('user_profiles').del()
	await knex('users').del()

	const freelancerId = knex.raw('gen_random_uuid()')
	const clientId = knex.raw('gen_random_uuid()')

	await knex('users').insert([
		{
			id: freelancerId,
			email: 'freelancer@test.com',
			password_hash: '$2a$10$XQKjm5Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9',
			role: 'freelancer',
			email_verified: true,
		},
		{
			id: clientId,
			email: 'client@test.com',
			password_hash: '$2a$10$XQKjm5Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9',
			role: 'client',
			email_verified: true,
		},
	])

	const [freelancerUser] = await knex('users').where('email', 'freelancer@test.com').select('id')
	const [clientUser] = await knex('users').where('email', 'client@test.com').select('id')

	await knex('user_profiles').insert([
		{
			user_id: freelancerUser.id,
			name: 'John Freelancer',
			bio: 'Expert in AI-powered content generation with 5 years of experience',
		},
		{
			user_id: clientUser.id,
			name: 'Jane Client',
			company_name: 'Tech Startup Inc',
			company_role: 'Product Manager',
		},
	])

	const [gpt4Skill] = await knex('skills').where('name', 'GPT-4').select('id')
	const [midjourneySkill] = await knex('skills').where('name', 'Midjourney').select('id')
	const [langchainSkill] = await knex('skills').where('name', 'LangChain').select('id')

	if (gpt4Skill && midjourneySkill && langchainSkill) {
		await knex('user_skills').insert([
			{
				user_id: freelancerUser.id,
				skill_id: gpt4Skill.id,
				proficiency_level: 'expert',
			},
			{
				user_id: freelancerUser.id,
				skill_id: midjourneySkill.id,
				proficiency_level: 'advanced',
			},
			{
				user_id: freelancerUser.id,
				skill_id: langchainSkill.id,
				proficiency_level: 'intermediate',
			},
		])
	}
}
