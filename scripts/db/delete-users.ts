import { kysely } from '../../src/lib/db'

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

async function promptConfirmation(message: string): Promise<boolean> {
	const readline = await import('readline')
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	return new Promise((resolve) => {
		rl.question(`${message} (yes/no): `, (answer) => {
			rl.close()
			resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y')
		})
	})
}

async function deleteAllUsers(force: boolean) {
	const users = await kysely.selectFrom('users').select(['id', 'email']).execute()

	if (users.length === 0) {
		console.warn('No users found in database.')
		return
	}

	console.warn(`\n⚠️  Found ${users.length} users:`)
	users.forEach((user) => {
		console.warn(`  - ${user.email} (${user.id})`)
	})

	if (!force) {
		const confirmed = await promptConfirmation(
			`\n⚠️  Are you sure you want to delete ALL ${users.length} users?`,
		)
		if (!confirmed) {
			console.warn('Operation cancelled.')
			return
		}
	}

	console.warn('\n🗑️  Deleting users and related data...')

	for (const user of users) {
		await deleteUserCascade(user.id, user.email)
	}

	console.warn(`\n✅ Successfully deleted ${users.length} users.`)

	await showRemainingUsers()
}

async function deleteUserByEmail(email: string, force: boolean) {
	const user = await kysely
		.selectFrom('users')
		.select(['id', 'email'])
		.where('email', '=', email)
		.executeTakeFirst()

	if (!user) {
		console.warn(`❌ User with email "${email}" not found.`)
		return
	}

	console.warn(`\n⚠️  Found user: ${user.email} (${user.id})`)

	if (!force) {
		const confirmed = await promptConfirmation(
			`\n⚠️  Are you sure you want to delete user "${email}"?`,
		)
		if (!confirmed) {
			console.warn('Operation cancelled.')
			return
		}
	}

	console.warn('\n🗑️  Deleting user and related data...')

	await deleteUserCascade(user.id, user.email)

	console.warn(`\n✅ Successfully deleted user "${email}".`)

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

	console.warn(`  • User: ${email}`)
	console.warn(`    - Deleted ${deletedSkills.length} user_skills`)
	console.warn(`    - Deleted ${deletedProfiles.length} user_profiles`)
	console.warn(`    - Deleted user record`)
}

async function showRemainingUsers() {
	const remainingUsers = await kysely
		.selectFrom('users')
		.select(['id', 'email', 'name', 'role'])
		.execute()

	console.warn(`\n📋 Remaining users: ${remainingUsers.length}`)

	if (remainingUsers.length === 0) {
		console.warn('  (No users left in database)')
	} else {
		remainingUsers.forEach((user) => {
			console.warn(`  - ${user.email} | ${user.name} | ${user.role}`)
		})
	}
}

async function main() {
	const args = parseArgs()

	if (!args.all && !args.email) {
		console.error('❌ Error: You must specify either --all or --email <email>')
		console.warn('\nUsage:')
		console.warn('  yarn db:delete-users --all              # Delete all users')
		console.warn('  yarn db:delete-users --email test@test.com  # Delete specific user')
		console.warn('  yarn db:delete-users --all --force      # Skip confirmation')
		process.exit(1)
	}

	if (args.all && args.email) {
		console.error('❌ Error: Cannot use --all and --email together')
		process.exit(1)
	}

	if (args.all) {
		await deleteAllUsers(args.force)
	} else if (args.email) {
		await deleteUserByEmail(args.email, args.force)
	}

	process.exit(0)
}

main().catch((error) => {
	console.error('Error:', error)
	process.exit(1)
})
