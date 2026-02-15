import { kysely } from './kysely'
import { pool } from './pool'

export { kysely } from './kysely'
export { pool } from './pool'

export const testConnection = async (): Promise<boolean> => {
	try {
		await pool.query('SELECT 1')
		return true
	} catch (error) {
		console.error('Database connection failed:', error)
		return false
	}
}

export const closeConnection = async (): Promise<void> => {
	await kysely.destroy()
	await pool.end()
}
