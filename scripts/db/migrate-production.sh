#!/bin/bash

set -e

echo "🚀 Running migrations for Production database..."

if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL environment variable is not set"
  echo ""
  echo "For Railway set:"
  echo "  export DATABASE_URL=<railway_database_url>"
  exit 1
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
yarn db:migrate:status

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
echo "4️⃣ Running migrations..."
if NODE_ENV=production yarn db:migrate; then
  echo ""
  echo "✅ Migrations completed successfully!"
  echo ""
  echo "Check status:"
  echo "  yarn db:migrate:status"
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
