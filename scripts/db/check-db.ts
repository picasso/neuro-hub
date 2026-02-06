/* eslint-disable no-console */
import { kysely } from '../../src/lib/db'

async function checkDatabase() {
	console.log('\n=== Checking Users ===')
	const users = await kysely.selectFrom('users').selectAll().limit(5).execute()

	console.log(`Found ${users.length} users:`)
	users.forEach((user) => {
		console.log(
			`- ID: ${user.id} | Email: ${user.email} | Name: ${user.name} | Role: ${user.role}`,
		)
	})

	console.log('\n=== Checking User Profiles ===')
	const profiles = await kysely.selectFrom('user_profiles').selectAll().limit(5).execute()

	console.log(`Found ${profiles.length} profiles:`)
	profiles.forEach((profile) => {
		console.log(
			`- ID: ${profile.id} | User ID: ${profile.user_id} | Name: ${profile.name} | Bio: ${profile.bio} | Company: ${profile.company_name}`,
		)
	})

	console.log('\n=== Checking Skills Library ===')
	const skillsCount = await kysely
		.selectFrom('skills')
		.select(({ fn }) => [fn.count<number>('id').as('count')])
		.executeTakeFirst()

	console.log(`Found ${skillsCount?.count || 0} skills in library`)

	console.log('\n=== Checking User Skills ===')
	const userSkills = await kysely
		.selectFrom('user_skills')
		.innerJoin('users', 'users.id', 'user_skills.user_id')
		.innerJoin('skills', 'skills.id', 'user_skills.skill_id')
		.select([
			'users.name as userName',
			'users.id as userId',
			'skills.name as skillName',
			'user_skills.proficiency_level',
		])
		.limit(20)
		.execute()

	console.log(`Found ${userSkills.length} user-skill assignments:`)
	userSkills.forEach((us) => {
		console.log(
			`- User: ${us.userName} (${us.userId}) | Skill: ${us.skillName} | Level: ${us.proficiency_level}`,
		)
	})

	process.exit(0)
}

checkDatabase().catch((error) => {
	console.error('Error checking database:', error)
	process.exit(1)
})
