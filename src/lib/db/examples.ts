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
			id: 'example-user-id',
			email: 'new@example.com',
			name: 'New User',
			role: 'freelancer',
			emailVerified: false,
			image: null,
		})
		.returningAll()
		.executeTakeFirst()

	await kysely
		.updateTable('users')
		.set({
			emailVerified: true,
		})
		.where('id', '=', 'example-user-id')
		.execute()

	await kysely.deleteFrom('users').where('id', '=', 'example-user-id').execute()

	const transaction = await kysely.transaction().execute(async (trx) => {
		const user = await trx
			.insertInto('users')
			.values({
				id: 'example-tx-user-id',
				email: 'tx@example.com',
				name: 'Tx User',
				role: 'client',
				emailVerified: false,
				image: null,
			})
			.returningAll()
			.executeTakeFirstOrThrow()

		await trx
			.insertInto('user_profiles')
			.values({
				id: user.id,
				user_id: user.id,
				name: 'Test User',
			})
			.execute()

		return user
	})

	return { user, users, skillsWithUsers, insertedUser, transaction }
}
