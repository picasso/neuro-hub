#!/bin/bash

set -e

echo "🔄 Importing data to Railway PostgreSQL database..."

if [ -z "$RAILWAY_DATABASE_URL" ]; then
  echo "❌ RAILWAY_DATABASE_URL environment variable is not set"
  echo ""
  echo "Get DATABASE_URL from Railway:"
  echo "  1. Open your project on railway.app"
  echo "  2. Go to PostgreSQL service"
  echo "  3. Copy DATABASE_URL from environment variables"
  echo ""
  echo "Then run:"
  echo "  export RAILWAY_DATABASE_URL=postgresql://..."
  exit 1
fi

if [ -z "$1" ]; then
  echo "❌ Import file not specified"
  echo ""
  echo "Usage:"
  echo "  yarn db:import <path_to_file.sql>"
  echo ""
  echo "Example:"
  echo "  yarn db:import ./backups/neurogig_export_20260125_120000.sql"
  exit 1
fi

IMPORT_FILE="$1"

if [ ! -f "$IMPORT_FILE" ]; then
  echo "❌ File not found: $IMPORT_FILE"
  exit 1
fi

echo "⚠️  WARNING: Import will overwrite existing data in Railway database!"
echo "   Database: $RAILWAY_DATABASE_URL"
echo "   File: $IMPORT_FILE"
echo ""
read -p "Continue? (yes/no): " -r
echo

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
  echo "❌ Import cancelled"
  exit 1
fi

echo "📦 Creating Railway database backup before import..."
BACKUP_DIR="./backups/railway"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/railway_backup_before_import_${TIMESTAMP}.sql"
mkdir -p "$BACKUP_DIR"

if command -v pg_dump &> /dev/null; then
  pg_dump "$RAILWAY_DATABASE_URL" \
    --no-owner \
    --no-acl \
    --if-exists \
    --clean \
    --file="$BACKUP_FILE" 2>/dev/null || echo "⚠️  Failed to create backup (database might be empty)"
  
  if [ -f "$BACKUP_FILE" ]; then
    echo "✅ Backup created: $BACKUP_FILE"
  fi
fi

echo ""
echo "🚀 Importing data..."

if command -v psql &> /dev/null; then
  psql "$RAILWAY_DATABASE_URL" < "$IMPORT_FILE"
  
  echo ""
  echo "✅ Import completed successfully!"
  echo ""
  echo "Verify data:"
  echo "  psql \"$RAILWAY_DATABASE_URL\" -c '\\dt'"
else
  echo "❌ psql not found. Install PostgreSQL client tools."
  echo ""
  echo "macOS: brew install postgresql"
  echo "Ubuntu: sudo apt-get install postgresql-client"
  exit 1
fi
