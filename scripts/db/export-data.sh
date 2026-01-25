#!/bin/bash

set -e

echo "🔄 Exporting data from local PostgreSQL database..."

if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL environment variable is not set"
  echo "Usage: export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/neurohub"
  exit 1
fi

EXPORT_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
EXPORT_FILE="${EXPORT_DIR}/neurohub_export_${TIMESTAMP}.sql"

mkdir -p "$EXPORT_DIR"

echo "📦 Creating database dump..."
echo "   File: $EXPORT_FILE"

if command -v pg_dump &> /dev/null; then
  pg_dump "$DATABASE_URL" \
    --no-owner \
    --no-acl \
    --if-exists \
    --clean \
    --file="$EXPORT_FILE"
  
  echo "✅ Export completed successfully!"
  echo "   File size: $(du -h "$EXPORT_FILE" | cut -f1)"
  echo ""
  echo "To import to Railway use:"
  echo "  yarn db:import $EXPORT_FILE"
else
  echo "❌ pg_dump not found. Install PostgreSQL client tools."
  echo ""
  echo "macOS: brew install postgresql"
  echo "Ubuntu: sudo apt-get install postgresql-client"
  exit 1
fi
