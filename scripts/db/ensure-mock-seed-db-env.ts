/**
 * Side-effect import: run before any `src/lib/db` import. The pg pool is created
 * at module load; `loadCwdDotenv` + `useProductionDatabaseUrlIfRequested` must run
 * first or `DATABASE_URL` is still empty and `pool` targets localhost (see
 * `src/lib/db/pool.ts`).
 */
import { loadCwdDotenv } from '../utils/load-cwd-dotenv'
import { useProductionDatabaseUrlIfRequested } from '../utils/production-railway-database-url'

loadCwdDotenv()
const production = process.argv.slice(2).includes('--production')
useProductionDatabaseUrlIfRequested(process.cwd(), production)
