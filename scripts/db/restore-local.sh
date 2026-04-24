#!/usr/bin/env bash
# Restores from the fixed snapshot: backups/local-latest.sql (from yarn db:backup)
# Destructive: --clean in the dump drops objects before restore.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
source "${ROOT_DIR}/scripts/utils/shell-utils.sh"

print_restore_usage() {
	print_usage \
		'  yarn db:restore' \
		'  yarn db:restore --force' \
		'  yarn db:restore --help'
}

parse_args() {
	FORCE=false

	if [[ $# -eq 0 ]]; then
		return
	fi

	for arg in "$@"; do
		case "${arg}" in
			--force)
				FORCE=true
				;;
			--help)
				print_empty
				print_section 'Local DB Restore'
				print_dim_text 'Restores backups/local-latest.sql into DATABASE_URL.'
				print_dim_text 'This replaces objects in the target local database.'
				print_empty
				print_restore_usage
				print_empty
				exit 0
				;;
			*)
				print_empty
				print_error 'Invalid arguments provided.'
				print_empty
				print_restore_usage
				print_empty
				exit 1
				;;
		esac
	done
}

BACKUP_FILE="${ROOT_DIR}/backups/local-latest.sql"
FORCE=false

main() {
	parse_args "$@"

	print_empty
	print_section 'Local DB Restore'

	load_env_var_if_needed 'DATABASE_URL' "${ROOT_DIR}/.env"

	if [[ -z "${DATABASE_URL:-}" ]]; then
		print_empty
		print_error 'DATABASE_URL is not set in the environment or .env.'
		print_empty
		exit 1
	fi

	require_local_database_url 'restore-local.sh'

	if [[ ! -f "${BACKUP_FILE}" ]]; then
		print_empty
		print_error "Backup file not found: ${BACKUP_FILE}"
		print_dim_text 'Create it first with: yarn db:backup'
		print_empty
		exit 1
	fi

	require_command 'psql' 'macOS: brew install postgresql@16'

	print_info 'Using backup file: ' "${BACKUP_FILE}"

	if [[ "${FORCE}" != 'true' ]]; then
		print_empty
		print_dim_text 'This will replace the current local database from DATABASE_URL.'
		print_dim_text 'The restore source is backups/local-latest.sql.'
		if ! prompt_yes_confirmation 'Type YES to continue: '; then
			print_empty
			print_info 'Operation cancelled.'
			print_empty
			exit 1
		fi
	fi

	print_empty
	print_info 'Restoring database...'
	psql "${DATABASE_URL}" -v ON_ERROR_STOP=1 -f "${BACKUP_FILE}"

	print_empty
	print_success 'Restore completed.'
	print_empty
}

main "$@"
