import { kysely } from '../../src/lib/db'
import {
	pluralize,
	printDataRow,
	printEmpty,
	printError,
	printInfo,
	printListItem,
	printSection,
	printSuccess,
	printText,
	printUsage,
	promptConfirmation,
} from '../utils/cli-utils'

type Args = {
	all: boolean
	email?: string
	force: boolean
}

function parseArgs(): Args {
	const args = process.argv.slice(2)
	return {
		all: args.includes('--all'),
		email: args.find((_arg, i) => args[i - 1] === '--email'),
		force: args.includes('--force'),
	}
}

async function deleteAllUsers(force: boolean) {
	const users = await kysely.selectFrom('users').select(['id', 'email', 'name', 'role']).execute()

	if (users.length === 0) {
		printEmpty()
		printInfo('No users found in database.')
		printEmpty()
		return
	}

	printEmpty()
	printSection('Delete All Users')

	const userCount = users.length
	printSuccess('Found ' + pluralize(userCount, 'user'))
	users.forEach((user) => {
		printDataRow([
			['Email', user.email],
			['Name', user.name],
			['Role', user.role],
		])
	})

	if (!force) {
		printEmpty()
		const confirmed = await promptConfirmation(
			'Are you sure you want to delete ALL ' + pluralize(userCount, 'user') + '?',
		)
		if (!confirmed) {
			printEmpty()
			printInfo('Operation cancelled.')
			printEmpty()
			return
		}
	}

	printEmpty()
	printInfo('Deleting users and related data...')

	for (const user of users) {
		await deleteUserCascade(user.id, user.email)
	}

	printEmpty()
	printSuccess('Successfully deleted ' + pluralize(userCount, 'user') + '.')

	await showRemainingUsers()
}

async function deleteUserByEmail(email: string, force: boolean) {
	const user = await kysely
		.selectFrom('users')
		.select(['id', 'email', 'name', 'role'])
		.where('email', '=', email)
		.executeTakeFirst()

	if (!user) {
		printEmpty()
		printError('User with email "' + email + '" not found.')
		printEmpty()
		return
	}

	printEmpty()
	printSection('Delete User')

	printSuccess('Found 1 user')
	printDataRow([
		['Email', user.email],
		['Name', user.name],
		['Role', user.role],
	])

	if (!force) {
		printEmpty()
		const confirmed = await promptConfirmation(
			'Are you sure you want to delete user "' + email + '"?',
		)
		if (!confirmed) {
			printEmpty()
			printInfo('Operation cancelled.')
			printEmpty()
			return
		}
	}

	printEmpty()
	printInfo('Deleting user and related data...')

	await deleteUserCascade(user.id, user.email)

	printEmpty()
	printSuccess('Successfully deleted user "' + email + '".')

	await showRemainingUsers()
}

async function deleteUserCascade(userId: string, email: string) {
	const deletedSkills = await kysely
		.deleteFrom('user_skills')
		.where('user_id', '=', userId)
		.execute()

	const deletedProfiles = await kysely
		.deleteFrom('user_profiles')
		.where('user_id', '=', userId)
		.execute()

	await kysely.deleteFrom('users').where('id', '=', userId).execute()

	printListItem('User: ' + email)
	printText('    - Deleted ' + deletedSkills.length + ' user_skills')
	printText('    - Deleted ' + deletedProfiles.length + ' user_profiles')
	printText('    - Deleted user record')
}

async function showRemainingUsers() {
	const remainingUsers = await kysely
		.selectFrom('users')
		.select(['id', 'email', 'name', 'role'])
		.execute()

	printEmpty()
	printSection('Remaining Users')

	const userCount = remainingUsers.length
	printSuccess('Found ' + pluralize(userCount, 'user'))

	if (remainingUsers.length > 0) {
		remainingUsers.forEach((user) => {
			printDataRow([
				['Email', user.email],
				['Name', user.name],
				['Role', user.role],
			])
		})
	}
}

async function main() {
	const args = parseArgs()

	if (!args.all && !args.email) {
		printError('You must specify either --all or --email <email>')
		printEmpty()
		printUsage([
			'  yarn db:delete-users --all                   # Delete all users',
			'  yarn db:delete-users --email test@test.com   # Delete specific user',
			'  yarn db:delete-users --all --force           # Skip confirmation',
		])
		printEmpty()
		process.exit(1)
	}

	if (args.all && args.email) {
		printError('Cannot use --all and --email together')
		process.exit(1)
	}

	if (args.all) {
		await deleteAllUsers(args.force)
	} else if (args.email) {
		await deleteUserByEmail(args.email, args.force)
	}

	printEmpty()
	process.exit(0)
}

main().catch((error) => {
	printEmpty()
	printError('Error: ' + error)
	printEmpty()
	process.exit(1)
})
