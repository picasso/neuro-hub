import knex, { type Knex } from 'knex'
import config from '../../../knexfile'

const environment = process.env.NODE_ENV || 'development'
const knexConfig = config[environment]

if (!knexConfig) {
	throw new Error(`No Knex configuration found for environment: ${environment}`)
}

export const db: Knex = knex(knexConfig)

export const testConnection = async (): Promise<boolean> => {
	try {
		await db.raw('SELECT 1')
		return true
	} catch (error) {
		console.error('Database connection failed:', error)
		return false
	}
}

export const closeConnection = async (): Promise<void> => {
	await db.destroy()
}

export default db
