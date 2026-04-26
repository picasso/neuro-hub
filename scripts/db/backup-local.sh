#!/usr/bin/env bash
# Overwrites a single local snapshot: backups/local-latest.sql
# Requires: pg_dump (PostgreSQL client tools)
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
source "${ROOT_DIR}/scripts/utils/shell-utils.sh"

print_backup_usage() {
	print_usage \
		'  yarn db:backup' \
		'  yarn db:backup --help'
}

parse_args() {
	if [[ $# -eq 0 ]]; then
		return
	fi

	if [[ $# -eq 1 && "${1}" == "--help" ]]; then
		print_empty
		print_section 'Local DB Backup'
		print_dim_text 'Creates or overwrites backups/local-latest.sql from DATABASE_URL.'
		print_empty
		print_backup_usage
		print_empty
		exit 0
	fi

	print_empty
	print_error 'Invalid arguments provided.'
	print_empty
	print_backup_usage
	print_empty
	exit 1
}

BACKUP_DIR="${ROOT_DIR}/backups"
BACKUP_FILE="${BACKUP_DIR}/local-latest.sql"

main() {
	parse_args "$@"

	print_empty
	print_section 'Local DB Backup'

	load_env_var_if_needed 'DATABASE_URL' "${ROOT_DIR}/.env"

	if [[ -z "${DATABASE_URL:-}" ]]; then
		print_empty
		print_error 'DATABASE_URL is not set in the environment or .env.'
		print_empty
		exit 1
	fi

	require_local_database_url 'backup-local.sh'

	require_command 'pg_dump' 'macOS: brew install postgresql@16'

	mkdir -p "${BACKUP_DIR}"

	print_info 'Writing backup to: ' "${BACKUP_FILE}"

	pg_dump "${DATABASE_URL}" \
		--no-owner \
		--no-acl \
		--if-exists \
		--clean \
		--file="${BACKUP_FILE}"

	print_empty
	print_success "Backup completed. Size: $(du -h "${BACKUP_FILE}" | cut -f1)"
	print_info 'Restore command: yarn db:restore'
	print_empty
}

main "$@"
