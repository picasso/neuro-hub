#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../../.env.production.local"
HAS_TEMP_DATABASE_URL=0

cleanup() {
  if [ "$HAS_TEMP_DATABASE_URL" -eq 1 ]; then
    unset DATABASE_URL
  fi
}

trap cleanup EXIT

echo "🚀 Running migrations for Production database..."

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

echo ""
echo "2️⃣ Checking migration status..."
KNEX_ENV=production yarn db:migrate:status

echo ""
echo "3️⃣ Creating backup before migration..."
BACKUP_DIR="./backups/railway"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/railway_backup_before_migration_${TIMESTAMP}.sql"
mkdir -p "$BACKUP_DIR"

if command -v pg_dump &> /dev/null; then
  pg_dump "$DATABASE_URL" \
    --no-owner \
    --no-acl \
    --if-exists \
    --clean \
    --file="$BACKUP_FILE" 2>/dev/null || echo "⚠️  Failed to create backup (database might be empty)"
  
  if [ -f "$BACKUP_FILE" ]; then
    echo "✅ Backup created: $BACKUP_FILE"
  fi
else
  echo "⚠️  pg_dump not found. Backup not created."
fi

echo ""
echo "4️⃣ Running Better Auth migrations..."
if yarn db:auth:migrate; then
  echo "✅ Better Auth migrations completed"
else
  echo ""
  echo "❌ Better Auth migration error!"
  exit 1
fi

echo ""
echo "5️⃣ Running Knex migrations..."
if NODE_ENV=production yarn db:migrate; then
  echo ""
  echo "✅ Migrations completed successfully!"
else
  echo ""
  echo "❌ Migration error!"
  echo ""
  if [ -f "$BACKUP_FILE" ]; then
    echo "To restore from backup:"
    echo "  psql \"\$DATABASE_URL\" < $BACKUP_FILE"
  fi
  exit 1
fi
