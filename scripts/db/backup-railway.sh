#!/bin/bash

set -e

echo "💾 Creating Railway PostgreSQL database backup..."

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

BACKUP_DIR="./backups/railway"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/railway_backup_${TIMESTAMP}.sql"

mkdir -p "$BACKUP_DIR"

echo "📦 Creating database dump..."
echo "   Database: ${RAILWAY_DATABASE_URL%%\?*}"
echo "   File: $BACKUP_FILE"

if command -v pg_dump &> /dev/null; then
  pg_dump "$RAILWAY_DATABASE_URL" \
    --no-owner \
    --no-acl \
    --if-exists \
    --clean \
    --file="$BACKUP_FILE"
  
  echo ""
  echo "✅ Backup created successfully!"
  echo "   File size: $(du -h "$BACKUP_FILE" | cut -f1)"
  echo ""
  echo "To restore use:"
  echo "  psql \"\$RAILWAY_DATABASE_URL\" < $BACKUP_FILE"
  echo ""
  echo "💡 Recommendation: Configure automatic backups in Railway"
  echo "   Railway Dashboard → PostgreSQL → Backups"
else
  echo "❌ pg_dump not found. Install PostgreSQL client tools."
  echo ""
  echo "macOS: brew install postgresql"
  echo "Ubuntu: sudo apt-get install postgresql-client"
  exit 1
fi

echo ""
echo "📋 Backup list:"
ls -lh "$BACKUP_DIR" | tail -n +2 | awk '{print "  " $9 " (" $5 ")"}'
