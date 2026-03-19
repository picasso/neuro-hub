import { kysely } from '../../src/lib/db'
import {
	pluralize,
	printDataRow,
	printEmpty,
	printError,
	printInfo,
	printSection,
	printSuccess,
	printText,
	printUsage,
	promptConfirmation,
} from '../utils/cli-utils'

type Args = {
	all: boolean
	applicationId?: string
	projectId?: string
	email?: string
	list: boolean
	force: boolean
}

function parseArgs(): Args {
	const args = process.argv.slice(2)
	return {
		all: args.includes('--all'),
		applicationId: valueAfterFlag(args, '--id'),
		projectId: valueAfterFlag(args, '--project'),
		email: valueAfterFlag(args, '--email'),
		list: args.includes('--list'),
		force: args.includes('--force'),
	}
}

function valueAfterFlag(args: string[], flag: string): string | undefined {
	const index = args.indexOf(flag)
	if (index === -1 || index >= args.length - 1) return undefined
	const next = args[index + 1]
	if (next.startsWith('--')) return undefined
	return next
}

const TITLE_MAX_LEN = 14

function truncateProjectTitleForList(title: string): string {
	if (title.length <= TITLE_MAX_LEN) return title
	return title.slice(0, TITLE_MAX_LEN) + '...'
}

type ApplicationRow = {
	id: string
	project_id: string
	freelancer_id: string
	status: string
	proposed_price: number
	created_at: Date | null
}

async function listApplicationsPreview(): Promise<ApplicationRow[]> {
	return kysely
		.selectFrom('applications')
		.select(['id', 'project_id', 'freelancer_id', 'status', 'proposed_price', 'created_at'])
		.orderBy('created_at', 'desc')
		.execute()
}

function printApplicationRows(rows: ApplicationRow[]) {
	rows.forEach((row) => {
		printDataRow([
			['ID', row.id],
			['Project', row.project_id],
			['Freelancer', row.freelancer_id],
			['Status', row.status],
			['Price', row.proposed_price],
		])
	})
}

async function deleteAllApplications(force: boolean) {
	const rows = await listApplicationsPreview()

	if (rows.length === 0) {
		printEmpty()
		printInfo('No applications found in database.')
		printEmpty()
		return
	}

	printEmpty()
	printSection('Delete All Applications')

	const count = rows.length
	printSuccess('Found ' + pluralize(count, 'application'))
	printApplicationRows(rows)

	if (!force) {
		printEmpty()
		const confirmed = await promptConfirmation(
			'Are you sure you want to delete ALL ' + pluralize(count, 'application') + '?',
		)
		if (!confirmed) {
			printEmpty()
			printInfo('Operation cancelled.')
			printEmpty()
			return
		}
	}

	printEmpty()
	printInfo('Deleting applications...')

	await kysely.deleteFrom('applications').execute()

	printEmpty()
	printSuccess('Successfully deleted ' + pluralize(count, 'application') + '.')

	await showRemainingApplications()
}

async function deleteApplicationById(applicationId: string, force: boolean) {
	const row = await kysely
		.selectFrom('applications')
		.select(['id', 'project_id', 'freelancer_id', 'status', 'proposed_price', 'created_at'])
		.where('id', '=', applicationId)
		.executeTakeFirst()

	if (!row) {
		printEmpty()
		printError('Application with id "' + applicationId + '" not found.')
		printEmpty()
		return
	}

	printEmpty()
	printSection('Delete Application')

	printSuccess('Found 1 application')
	printApplicationRows([row])

	if (!force) {
		printEmpty()
		const confirmed = await promptConfirmation(
			'Are you sure you want to delete this application?',
		)
		if (!confirmed) {
			printEmpty()
			printInfo('Operation cancelled.')
			printEmpty()
			return
		}
	}

	printEmpty()
	printInfo('Deleting application...')

	await kysely.deleteFrom('applications').where('id', '=', applicationId).execute()

	printEmpty()
	printSuccess('Successfully deleted application "' + applicationId + '".')

	await showRemainingApplications()
}

async function deleteApplicationsByProject(projectId: string, force: boolean) {
	const project = await kysely
		.selectFrom('projects')
		.select(['id', 'title'])
		.where('id', '=', projectId)
		.executeTakeFirst()

	if (!project) {
		printEmpty()
		printError('Project with id "' + projectId + '" not found.')
		printEmpty()
		return
	}

	const rows = await kysely
		.selectFrom('applications')
		.select(['id', 'project_id', 'freelancer_id', 'status', 'proposed_price', 'created_at'])
		.where('project_id', '=', projectId)
		.orderBy('created_at', 'desc')
		.execute()

	if (rows.length === 0) {
		printEmpty()
		printInfo('No applications for this project.')
		printEmpty()
		return
	}

	printEmpty()
	printSection('Delete Applications By Project')

	printText('Project: ' + project.title + ' (' + project.id + ')')
	printSuccess('Found ' + pluralize(rows.length, 'application'))
	printApplicationRows(rows)

	if (!force) {
		printEmpty()
		const confirmed = await promptConfirmation(
			'Delete all ' + pluralize(rows.length, 'application') + ' for this project?',
		)
		if (!confirmed) {
			printEmpty()
			printInfo('Operation cancelled.')
			printEmpty()
			return
		}
	}

	printEmpty()
	printInfo('Deleting applications...')

	await kysely.deleteFrom('applications').where('project_id', '=', projectId).execute()

	printEmpty()
	printSuccess('Successfully deleted ' + pluralize(rows.length, 'application') + ' for project.')

	await showRemainingApplications()
}

type ApplicationListRow = {
	applicationId: string
	freelancerEmail: string
	projectTitle: string
	projectId: string
}

async function fetchApplicationsWithJoins(): Promise<ApplicationListRow[]> {
	return kysely
		.selectFrom('applications as application')
		.innerJoin('users as freelancer', 'freelancer.id', 'application.freelancer_id')
		.innerJoin('projects as project', 'project.id', 'application.project_id')
		.select([
			'application.id as applicationId',
			'freelancer.email as freelancerEmail',
			'project.title as projectTitle',
			'project.id as projectId',
		])
		.orderBy('application.created_at', 'desc')
		.execute()
}

async function listApplications() {
	printEmpty()
	printSection('Applications List')

	const rows = await fetchApplicationsWithJoins()

	if (rows.length === 0) {
		printInfo('No applications found.')
		printEmpty()
		return
	}

	printSuccess('Found ' + pluralize(rows.length, 'application'))
	rows.forEach((row) => {
		printDataRow([
			['ID', row.applicationId],
			['Email', row.freelancerEmail],
			['Project', truncateProjectTitleForList(row.projectTitle)],
			['Project ID', row.projectId],
		])
	})

	printEmpty()
}

async function deleteApplicationsByFreelancerEmail(email: string, force: boolean) {
	const user = await kysely
		.selectFrom('users')
		.select(['id', 'email'])
		.where('email', '=', email)
		.executeTakeFirst()

	if (!user) {
		printEmpty()
		printError('User with email "' + email + '" not found.')
		printEmpty()
		return
	}

	const rows = await kysely
		.selectFrom('applications')
		.select(['id', 'project_id', 'freelancer_id', 'status', 'proposed_price', 'created_at'])
		.where('freelancer_id', '=', user.id)
		.orderBy('created_at', 'desc')
		.execute()

	if (rows.length === 0) {
		printEmpty()
		printInfo('No applications for freelancer "' + email + '".')
		printEmpty()
		return
	}

	printEmpty()
	printSection('Delete Applications By Freelancer Email')

	printText('Freelancer: ' + user.email + ' (' + user.id + ')')
	printSuccess('Found ' + pluralize(rows.length, 'application'))
	printApplicationRows(rows)

	if (!force) {
		printEmpty()
		const confirmed = await promptConfirmation(
			'Delete all ' + pluralize(rows.length, 'application') + ' for this freelancer?',
		)
		if (!confirmed) {
			printEmpty()
			printInfo('Operation cancelled.')
			printEmpty()
			return
		}
	}

	printEmpty()
	printInfo('Deleting applications...')

	await kysely.deleteFrom('applications').where('freelancer_id', '=', user.id).execute()

	printEmpty()
	printSuccess(
		'Successfully deleted ' + pluralize(rows.length, 'application') + ' for freelancer.',
	)

	await showRemainingApplications()
}

async function showRemainingApplications() {
	const remaining = await kysely
		.selectFrom('applications')
		.select(['id', 'project_id', 'freelancer_id', 'status', 'proposed_price', 'created_at'])
		.orderBy('created_at', 'desc')
		.execute()

	printEmpty()
	printSection('Remaining Applications')

	const count = remaining.length
	printSuccess('Found ' + pluralize(count, 'application'))

	if (remaining.length > 0) {
		printApplicationRows(remaining)
	}
}

async function main() {
	const args = parseArgs()

	const modeCount = [
		args.all,
		!!args.applicationId,
		!!args.projectId,
		!!args.email,
		args.list,
	].filter(Boolean).length

	if (modeCount !== 1) {
		printError(
			'Specify exactly one of: --list | --all | --id <uuid> | --project <uuid> | --email <email>',
		)
		printEmpty()
		printUsage([
			'  yarn db:delete-applications --list                              # List all applications',
			'  yarn db:delete-applications --all                               # Delete every application',
			'  yarn db:delete-applications --id <application-uuid>             # Delete one application',
			'  yarn db:delete-applications --project <project-uuid>            # Delete all for a project',
			'  yarn db:delete-applications --email freelancer@example.com      # Delete all for freelancer',
			'  yarn db:delete-applications --email x@y.z --force               # Skip confirmation',
		])
		printEmpty()
		process.exit(1)
	}

	if (args.list) {
		await listApplications()
	} else if (args.all) {
		await deleteAllApplications(args.force)
	} else if (args.applicationId) {
		await deleteApplicationById(args.applicationId, args.force)
	} else if (args.projectId) {
		await deleteApplicationsByProject(args.projectId, args.force)
	} else if (args.email) {
		await deleteApplicationsByFreelancerEmail(args.email, args.force)
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
