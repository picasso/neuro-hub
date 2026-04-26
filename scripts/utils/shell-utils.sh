#!/usr/bin/env bash
#
# Colored output aligned with scripts/utils/cli-utils.ts (chalk: cyan, green, blue, red, dim cyan for usage).
# Honors https://no-color.org/ when NO_COLOR is set. Disables styling when stdout/stderr is not a TTY.

if [[ -z "${NO_COLOR:-}" && -t 1 ]]; then
	SGR_RESET=$'\033[0m'
	SGR_CYAN=$'\033[36m'
	SGR_DIM_CYAN=$'\033[2;36m'
	SGR_GREEN=$'\033[32m'
	SGR_BLUE=$'\033[34m'
	SGR_DIM_BLUE=$'\033[2;34m'
else
	SGR_RESET=''
	SGR_CYAN=''
	SGR_DIM_CYAN=''
	SGR_GREEN=''
	SGR_BLUE=''
	SGR_DIM_BLUE=''
fi

if [[ -z "${NO_COLOR:-}" && -t 2 ]]; then
	SGR_RESET_ERR=$'\033[0m'
	SGR_RED_ERR=$'\033[31m'
else
	SGR_RESET_ERR=''
	SGR_RED_ERR=''
fi

print_empty() {
	printf '\n'
}

print_section() {
	local title_upper line i
	title_upper=$(printf '%s' "$1" | tr '[:lower:]' '[:upper:]')
	line=''
	for ((i = 0; i < 32; i++)); do
		line+='━'
	done
	printf '%s%s%s\n' "${SGR_CYAN}" "${title_upper}" "${SGR_RESET}"
	printf '%s%s%s\n' "${SGR_CYAN}" "${line}" "${SGR_RESET}"
}

print_success() {
	printf '%s✓ %s%s\n' "${SGR_GREEN}" "$1" "${SGR_RESET}"
}

print_info() {
	local second="${2:-}"
	if [[ -n "${second}" ]]; then
		printf '%s◆ %s%s%s%s\n' "${SGR_BLUE}" "$1" "${SGR_DIM_CYAN}" "${second}" "${SGR_RESET}"
	else
		printf '%s◆ %s%s\n' "${SGR_BLUE}" "$1" "${SGR_RESET}"
	fi
}

print_error() {
	printf '%s✖ %s%s\n' "${SGR_RED_ERR}" "$1" "${SGR_RESET_ERR}" >&2
}

print_text() {
	printf '%s\n' "$1"
}

print_dim_text() {
	printf '%s%s%s\n' "${SGR_DIM_BLUE}" "$1" "${SGR_RESET}"
}

print_usage() {
	local line
	printf '%sUsage:%s\n' "${SGR_DIM_CYAN}" "${SGR_RESET}"
	for line in "$@"; do
		printf '%s%s%s\n' "${SGR_DIM_CYAN}" "${line}" "${SGR_RESET}"
	done
}

load_env_var_if_needed() {
	local var_name="$1"
	local env_file="$2"
	local value=''

	if [[ -n "${!var_name:-}" || ! -f "${env_file}" ]]; then
		return
	fi

	value="$(
		awk -F= -v key="${var_name}" '
			/^[[:space:]]*#/ { next }
			{
				current_key = $1
				gsub(/^[[:space:]]+|[[:space:]]+$/, "", current_key)
				if (current_key == key) {
					sub(/^[^=]*=/, "")
					print
					exit
				}
			}
		' "${env_file}"
	)"

	value="${value%$'\r'}"

	if [[ "${value}" =~ ^\".*\"$ || "${value}" =~ ^\'.*\'$ ]]; then
		value="${value:1:-1}"
	fi

	if [[ -z "${value}" ]]; then
		return
	fi

	printf -v "${var_name}" '%s' "${value}"
	export "${var_name}"
}

require_local_database_url() {
	local script_name="$1"

	case "${DATABASE_URL}" in
		*@localhost:* | *@localhost/* | *@127.0.0.1:* | *@127.0.0.1/*)
			;;
		*)
			print_empty
			print_error "Safety check failed: ${script_name} only supports local DATABASE_URL targets."
			print_text 'Expected host: localhost or 127.0.0.1'
			print_empty
			exit 1
			;;
	esac
}

require_command() {
	local command_name="$1"
	local install_hint="$2"

	if command -v "${command_name}" >/dev/null 2>&1; then
		return
	fi

	print_empty
	print_error "${command_name} not found. Install PostgreSQL client tools first."
	print_text "${install_hint}"
	print_empty
	exit 1
}

prompt_yes_confirmation() {
	local prompt_message="$1"
	local reply

	read -r -p "${prompt_message}" reply
	[[ "${reply}" == 'YES' ]]
}
