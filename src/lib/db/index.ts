import { formatDatabaseConnectionError } from './connection-error'
import { kysely } from './kysely'
import { pool } from './pool'

export { kysely } from './kysely'
export { pool } from './pool'

export const testConnection = async (): Promise<boolean> => {
	try {
		await pool.query('SELECT 1')
		return true
	} catch (error) {
		const formattedError = formatDatabaseConnectionError(error)
		console.error('Database connection failed:', formattedError.message)
		formattedError.hints.forEach((hint) => {
			console.error('  ' + hint)
		})
		return false
	}
}

export const closeConnection = async (): Promise<void> => {
	await kysely.destroy()
	await pool.end()
}
