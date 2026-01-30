import { sql } from 'kysely'
import { kysely } from '../../src/lib/db'

async function getAllTables(): Promise<string[]> {
	const result = await sql<{ table_name: string }>`
		SELECT table_name 
		FROM information_schema.tables 
		WHERE table_schema = 'public' 
		AND table_type = 'BASE TABLE'
	`.execute(kysely)

	return result.rows.map((row) => row.table_name)
}

async function dropAllTables(force: boolean = false) {
	const databaseUrl = process.env.DATABASE_URL || ''

	if (!databaseUrl) {
		console.error('❌ DATABASE_URL environment variable is not set')
		process.exit(1)
	}

	if (databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')) {
		console.error('❌ Safety check: Cannot drop tables on localhost database')
		console.error('   Use this script only for remote databases (Railway, etc.)')
		process.exit(1)
	}

	console.warn('\n🗑️  DROP ALL TABLES')
	console.warn('='.repeat(50))
	console.warn(`Database: ${databaseUrl.split('@')[1]?.split('?')[0] || 'unknown'}`)

	const tables = await getAllTables()

	if (tables.length === 0) {
		console.warn('\n✅ No tables found. Database is already empty.')
		process.exit(0)
	}

	console.warn(`\n⚠️  Found ${tables.length} tables:`)
	tables.forEach((table) => {
		console.warn(`  - ${table}`)
	})

	if (!force) {
		console.warn('\n⚠️  This will DROP ALL tables and data!')
		console.warn('   Run with --force to proceed without confirmation')
		process.exit(1)
	}

	console.warn('\n🗑️  Dropping all tables...')

	for (const table of tables) {
		try {
			await kysely.schema.dropTable(table).cascade().execute()
			console.warn(`  ✓ Dropped: ${table}`)
		} catch (error) {
			console.error(`  ✗ Failed to drop ${table}:`, error)
		}
	}

	const remainingTables = await getAllTables()

	if (remainingTables.length === 0) {
		console.warn('\n✅ All tables dropped successfully!')
	} else {
		console.error(`\n⚠️  ${remainingTables.length} tables still remain:`)
		remainingTables.forEach((table) => {
			console.error(`  - ${table}`)
		})
		process.exit(1)
	}

	process.exit(0)
}

const force = process.argv.includes('--force')

dropAllTables(force).catch((error) => {
	console.error('Error:', error)
	process.exit(1)
})
