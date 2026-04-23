#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../../.env.production.local"
HAS_TEMP_DATABASE_URL=0
USE_BACKUP=0

for arg in "$@"; do
  case "$arg" in
    --backup) USE_BACKUP=1 ;;
  esac
done

cleanup() {
  if [ "$HAS_TEMP_DATABASE_URL" -eq 1 ]; then
    unset DATABASE_URL
  fi
}

trap cleanup EXIT

echo "🌱 Running seeds for Production database..."
if [ "$USE_BACKUP" -eq 1 ]; then
  echo "   (with --backup: pg_dump before seed run)"
fi
echo ""

if [ -z "$DATABASE_URL" ]; then
  if [ ! -f "$ENV_FILE" ]; then
    echo "❌ DATABASE_URL environment variable is not set"
    echo ""
    echo "Also could not find $ENV_FILE"
    exit 1
  fi

  RAILWAY_DATABASE_URL=$(sed -n 's/^RAILWAY_DATABASE_URL=//p' "$ENV_FILE")

  if [ -z "$RAILWAY_DATABASE_URL" ]; then
    echo "❌ RAILWAY_DATABASE_URL is not set in $ENV_FILE"
    exit 1
  fi

  export DATABASE_URL="$RAILWAY_DATABASE_URL"
  HAS_TEMP_DATABASE_URL=1
  echo "✅ DATABASE_URL loaded from [.env.production.local] for this script session"
fi

echo "📊 Database: ${DATABASE_URL%%\?*}"
echo ""

echo "1️⃣ Checking database connection..."
if ! yarn db:test > /dev/null 2>&1; then
  echo "❌ Failed to connect to database"
  echo "Check DATABASE_URL and server availability"
  exit 1
fi
echo "✅ Connection successful"

BACKUP_FILE=""

if [ "$USE_BACKUP" -eq 1 ]; then
  echo ""
  echo "2️⃣ Creating backup before seed..."
  BACKUP_DIR="./backups/railway"
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  BACKUP_FILE="${BACKUP_DIR}/railway_backup_before_seed_${TIMESTAMP}.sql"
  mkdir -p "$BACKUP_DIR"

  if command -v pg_dump &> /dev/null; then
    if pg_dump "$DATABASE_URL" \
      --no-owner \
      --no-acl \
      --if-exists \
      --clean \
      --file="$BACKUP_FILE" 2>/dev/null; then
      if [ -f "$BACKUP_FILE" ]; then
        echo "✅ Backup created: $BACKUP_FILE"
      fi
    else
      echo "⚠️  Failed to create backup (database might be empty or pg_dump error)"
    fi
  else
    echo "⚠️  pg_dump not found. Backup not created."
  fi
fi

echo ""
SEED_STEP="2️⃣"
if [ "$USE_BACKUP" -eq 1 ]; then
  SEED_STEP="3️⃣"
fi
echo "${SEED_STEP} Running Knex seed:run (production)..."
if NODE_ENV=production yarn db:seed; then
  echo "✅ Seeds completed successfully"
else
  echo ""
  echo "❌ Seed error!"
  echo ""
  if [ -n "$BACKUP_FILE" ] && [ -f "$BACKUP_FILE" ]; then
    echo "To restore from backup:"
    echo "  psql \"\$DATABASE_URL\" < $BACKUP_FILE"
  fi
  exit 1
fi

STATUS_STEP="3️⃣"
if [ "$USE_BACKUP" -eq 1 ]; then
  STATUS_STEP="4️⃣"
fi
echo ""
echo "${STATUS_STEP} Seed status..."
if KNEX_ENV=production yarn db:seed:status; then
  echo ""
  echo "✅ Done"
else
  echo ""
  echo "❌ Failed to print seed status (seeds may still have been applied)"
  exit 1
fi
