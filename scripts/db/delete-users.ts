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
	id?: string
	list: boolean
}

type UserRow = {
	id: string
	email: string
	name: string
	role: string
}

function parseArgs(): Args {
	const args = process.argv.slice(2)
	return {
		all: args.includes('--all'),
		email: valueAfterFlag(args, '--email'),
		force: args.includes('--force'),
		id: valueAfterFlag(args, '--id'),
		list: args.includes('--list'),
	}
}

function valueAfterFlag(args: string[], flag: string): string | undefined {
	const index = args.indexOf(flag)
	if (index === -1 || index >= args.length - 1) return undefined
	const next = args[index + 1]
	if (next.startsWith('--')) return undefined
	return next
}

async function listUsersPreview(): Promise<UserRow[]> {
	return kysely.selectFrom('users').select(['id', 'email', 'name', 'role']).execute()
}

function printUserRows(users: UserRow[]) {
	users.forEach((user) => {
		printDataRow([
			['Email', user.email],
			['Name', user.name],
			['Role', user.role],
			['User ID', user.id],
		])
	})
}

async function getUserByEmail(email: string) {
	return kysely
		.selectFrom('users')
		.select(['id', 'email', 'name', 'role'])
		.where('email', '=', email)
		.executeTakeFirst()
}

async function getUserById(id: string) {
	return kysely
		.selectFrom('users')
		.select(['id', 'email', 'name', 'role'])
		.where('id', '=', id)
		.executeTakeFirst()
}

async function listUsers() {
	printEmpty()
	printSection('Users List')

	const users = await listUsersPreview()

	if (users.length === 0) {
		printInfo('No users found.')
		printEmpty()
		return
	}

	printSuccess('Found ' + pluralize(users.length, 'user'))
	printUserRows(users)

	printEmpty()
}

async function deleteAllUsers(force: boolean) {
	const users = await listUsersPreview()

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
	printUserRows(users)

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
	const user = await getUserByEmail(email)

	if (!user) {
		printEmpty()
		printError('User with email "' + email + '" not found.')
		printEmpty()
		return
	}

	printEmpty()
	printSection('Delete User')

	printSuccess('Found 1 user')
	printUserRows([user])

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

async function deleteUserById(id: string, force: boolean) {
	const user = await getUserById(id)

	if (!user) {
		printEmpty()
		printError('User with id "' + id + '" not found.')
		printEmpty()
		return
	}

	printEmpty()
	printSection('Delete User')

	printSuccess('Found 1 user')
	printUserRows([user])

	if (!force) {
		printEmpty()
		const confirmed = await promptConfirmation('Are you sure you want to delete this user?')
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
	printSuccess('Successfully deleted user "' + id + '".')

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
	const remainingUsers = await listUsersPreview()

	printEmpty()
	printSection('Remaining Users')

	const userCount = remainingUsers.length
	printSuccess('Found ' + pluralize(userCount, 'user'))

	if (remainingUsers.length > 0) {
		printUserRows(remainingUsers)
	}
}

async function main() {
	const args = parseArgs()

	const modeCount = [args.all, !!args.email, !!args.id, args.list].filter(Boolean).length

	if (modeCount !== 1) {
		printError('Specify exactly one of: --list | --all | --email <email> | --id <user-id>')
		printEmpty()
		printUsage([
			'  yarn db:delete-users --list                  # List all users',
			'  yarn db:delete-users --all                   # Delete all users',
			'  yarn db:delete-users --email test@test.com   # Delete user by email',
			'  yarn db:delete-users --id <user-id>          # Delete user by id',
			'  yarn db:delete-users --all --force           # Skip confirmation',
		])
		printEmpty()
		process.exit(1)
	}

	if (args.list) {
		await listUsers()
	} else if (args.all) {
		await deleteAllUsers(args.force)
	} else if (args.email) {
		await deleteUserByEmail(args.email, args.force)
	} else if (args.id) {
		await deleteUserById(args.id, args.force)
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
