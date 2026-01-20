/* eslint-disable no-console */
import { db, testConnection, closeConnection } from './index'

async function main() {
	console.log('🔍 Testing database connection...\n')

	const isConnected = await testConnection()

	if (isConnected) {
		console.log('✅ Database connection successful!\n')

		try {
			const result = await db.raw('SELECT version()')
			console.log('📊 PostgreSQL version:')
			console.log(result.rows[0].version)
			console.log()

			const tables = await db
				.select('tablename')
				.from('pg_tables')
				.where('schemaname', 'public')
			console.log('📋 Available tables:')
			tables.forEach((table) => {
				console.log(`   - ${table.tablename}`)
			})
			console.log()
		} catch (error) {
			console.error('❌ Error querying database:', error)
		}
	} else {
		console.log('❌ Database connection failed!')
		console.log('\n💡 Make sure PostgreSQL is running:\n   docker compose up -d postgres\n')
	}

	await closeConnection()
	process.exit(isConnected ? 0 : 1)
}

main()
