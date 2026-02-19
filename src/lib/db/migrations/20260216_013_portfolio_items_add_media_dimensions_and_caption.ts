import type { Knex } from 'knex'

/**
 * Add media dimensions and caption for correct portfolio gallery aspect ratios.
 *
 * Columns:
 * - media_width  (int, nullable)
 * - media_height (int, nullable)
 * - caption      (text, nullable)
 */
export async function up(knex: Knex): Promise<void> {
	const hasMediaWidth = await knex.schema.hasColumn('portfolio_items', 'media_width')
	const hasMediaHeight = await knex.schema.hasColumn('portfolio_items', 'media_height')
	const hasCaption = await knex.schema.hasColumn('portfolio_items', 'caption')

	if (hasMediaWidth && hasMediaHeight && hasCaption) return

	await knex.schema.alterTable('portfolio_items', (table) => {
		if (!hasMediaWidth) table.integer('media_width')
		if (!hasMediaHeight) table.integer('media_height')
		if (!hasCaption) table.text('caption')
	})
}

export async function down(knex: Knex): Promise<void> {
	const hasMediaWidth = await knex.schema.hasColumn('portfolio_items', 'media_width')
	const hasMediaHeight = await knex.schema.hasColumn('portfolio_items', 'media_height')
	const hasCaption = await knex.schema.hasColumn('portfolio_items', 'caption')

	if (!hasMediaWidth && !hasMediaHeight && !hasCaption) return

	await knex.schema.alterTable('portfolio_items', (table) => {
		if (hasCaption) table.dropColumn('caption')
		if (hasMediaHeight) table.dropColumn('media_height')
		if (hasMediaWidth) table.dropColumn('media_width')
	})
}
