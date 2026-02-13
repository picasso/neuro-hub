import { kysely } from '../../src/lib/db'
import {
	pluralize,
	printDataRow,
	printEmpty,
	printError,
	printSection,
	printSuccess,
} from '../utils/cli-utils'

async function checkDatabase() {
	printEmpty()
	printSection('Checking Users')

	const users = await kysely.selectFrom('users').selectAll().limit(5).execute()

	const userCount = users.length
	printSuccess('Found ' + pluralize(userCount, 'user'))
	users.forEach((user) => {
		const emailStatus = user.emailVerified ? 'verified' : 'not verified'
		printDataRow([
			['ID', user.id],
			['Email', user.email + ' [' + emailStatus + ']'],
			['Name', user.name],
			['Role', user.role],
		])
	})

	printEmpty()
	printSection('Checking User Profiles')

	const profiles = await kysely.selectFrom('user_profiles').selectAll().limit(5).execute()

	const profileCount = profiles.length
	printSuccess('Found ' + pluralize(profileCount, 'profile'))
	profiles.forEach((profile) => {
		printDataRow([
			['ID', profile.id],
			['User ID', profile.user_id],
			['Name', profile.name],
			['Bio', profile.bio],
			['Company', profile.company_name],
		])
	})

	printEmpty()
	printSection('Checking Skills Library')

	const skillsCount = await kysely
		.selectFrom('skills')
		.select(({ fn }) => [fn.count<number>('id').as('count')])
		.executeTakeFirst()

	const skillCount = Number(skillsCount?.count || 0)
	printSuccess('Found ' + pluralize(skillCount, 'skill') + ' in library')

	printEmpty()
	printSection('Checking User Skills')

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

	const assignmentCount = userSkills.length
	printSuccess('Found ' + pluralize(assignmentCount, 'user-skill assignment'))
	userSkills.forEach((us) => {
		printDataRow([
			['User', us.userName + ' (' + us.userId + ')'],
			['Skill', us.skillName],
			['Level', us.proficiency_level],
		])
	})

	printEmpty()
	process.exit(0)
}

checkDatabase().catch((error) => {
	printEmpty()
	printError('Error checking database: ' + error)
	printEmpty()
	process.exit(1)
})
