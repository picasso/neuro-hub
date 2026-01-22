import { kysely } from './kysely'

export async function exampleQueries() {
	const user = await kysely
		.selectFrom('users')
		.selectAll()
		.where('email', '=', 'test@example.com')
		.executeTakeFirst()

	const users = await kysely
		.selectFrom('users')
		.innerJoin('user_profiles', 'users.id', 'user_profiles.user_id')
		.select([
			'users.id',
			'users.email',
			'users.role',
			'user_profiles.name',
			'user_profiles.avatar_url',
		])
		.where('users.role', '=', 'freelancer')
		.execute()

	const skillsWithUsers = await kysely
		.selectFrom('skills')
		.leftJoin('user_skills', 'skills.id', 'user_skills.skill_id')
		.leftJoin('users', 'user_skills.user_id', 'users.id')
		.select([
			'skills.id',
			'skills.name',
			'skills.category',
			'user_skills.proficiency_level',
			'users.email',
		])
		.execute()

	const insertedUser = await kysely
		.insertInto('users')
		.values({
			email: 'new@example.com',
			role: 'freelancer',
		})
		.returningAll()
		.executeTakeFirst()

	await kysely
		.updateTable('users')
		.set({
			email_verified: true,
			email_verified_at: new Date(),
		})
		.where('id', '=', 'some-uuid')
		.execute()

	await kysely.deleteFrom('users').where('id', '=', 'some-uuid').execute()

	const transaction = await kysely.transaction().execute(async (trx) => {
		const user = await trx
			.insertInto('users')
			.values({
				email: 'tx@example.com',
				role: 'client',
			})
			.returningAll()
			.executeTakeFirstOrThrow()

		await trx
			.insertInto('user_profiles')
			.values({
				user_id: user.id,
				name: 'Test User',
			})
			.execute()

		return user
	})

	return { user, users, skillsWithUsers, insertedUser, transaction }
}
