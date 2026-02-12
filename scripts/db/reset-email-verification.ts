import { kysely } from '../../src/lib/db'
import {
	printDataRow,
	printEmpty,
	printError,
	printInfo,
	printSection,
	printSuccess,
	printUsage,
	promptConfirmation,
} from '../utils/cli-utils'

type Args = {
	email?: string
	force: boolean
}

function parseArgs(): Args {
	const args = process.argv.slice(2)
	return {
		email: args.find((_arg, i) => args[i - 1] === '--email'),
		force: args.includes('--force'),
	}
}

async function resetEmailVerificationByEmail(email: string, force: boolean) {
	const user = await kysely
		.selectFrom('users')
		.select(['id', 'email', 'name', 'role', 'emailVerified'])
		.where('email', '=', email)
		.executeTakeFirst()

	if (!user) {
		printEmpty()
		printError('User with email "' + email + '" not found.')
		printEmpty()
		return
	}

	printEmpty()
	printSection('Reset Email Verification')

	printSuccess('Found 1 user')
	printDataRow([
		['Email', user.email + ' ' + (user.emailVerified ? '✓' : '✖')],
		['Name', user.name],
		['Role', user.role],
	])

	if (!user.emailVerified) {
		printEmpty()
		printInfo('Email is already unverified. No changes needed.')
		printEmpty()
		return
	}

	if (!force) {
		printEmpty()
		const confirmed = await promptConfirmation(
			'Reset email verification for "' + email + '"? The user will need to verify again.',
		)
		if (!confirmed) {
			printEmpty()
			printInfo('Operation cancelled.')
			printEmpty()
			return
		}
	}

	printEmpty()
	printInfo('Resetting email verification...')

	await kysely
		.updateTable('users')
		.set({
			emailVerified: false,
		})
		.where('id', '=', user.id)
		.execute()

	printEmpty()
	printSuccess('Email verification reset for "' + email + '".')
	printEmpty()
}

async function main() {
	const args = parseArgs()

	if (!args.email) {
		printError('You must specify --email <email>')
		printEmpty()
		printUsage([
			'  yarn db:reset-email-verification --email test@test.com        # Reset verification',
			'  yarn db:reset-email-verification --email test@test.com --force # Skip confirmation',
		])
		printEmpty()
		process.exit(1)
	}

	await resetEmailVerificationByEmail(args.email, args.force)
	process.exit(0)
}

main().catch((error) => {
	printEmpty()
	printError('Error: ' + error)
	printEmpty()
	process.exit(1)
})
