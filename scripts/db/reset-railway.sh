#!/bin/bash

set -e

# Check for --force flag
FORCE=false
if [[ "$1" == "--force" ]]; then
  FORCE=true
fi

echo "🔄 RESET RAILWAY DATABASE"
echo "=" | tr '\n' '=' | head -c 50; echo ""
echo ""

# Check DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL environment variable is not set"
  echo ""
  echo "Set Railway database URL:"
  echo "  export DATABASE_URL=<railway_database_url>"
  exit 1
fi

# Safety check - prevent running on localhost
if [[ "$DATABASE_URL" == *"localhost"* ]] || [[ "$DATABASE_URL" == *"127.0.0.1"* ]]; then
  echo "❌ Safety check failed: DATABASE_URL points to localhost"
  echo "   This script is only for remote databases (Railway, etc.)"
  exit 1
fi

# Extract database info for display
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\(.*\):.*/\1/p')
echo "📊 Target database: $DB_HOST"
echo ""

# Confirmation prompt (skip if --force)
if [ "$FORCE" = false ]; then
  read -p "⚠️  This will DROP ALL tables and data! Continue? (yes/no): " -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
    echo "❌ Operation cancelled"
    exit 0
  fi
fi

echo "Step 1/4: Dropping all tables..."
echo "─────────────────────────────────────────────────"
if yarn db:drop-all --force; then
  echo "✅ All tables dropped"
else
  echo "❌ Failed to drop tables"
  exit 1
fi

echo ""
echo "Step 2/4: Running Better Auth migrations..."
echo "─────────────────────────────────────────────────"
if yes | npx @better-auth/cli migrate; then
  echo "✅ Better Auth migrations completed"
else
  echo "❌ Better Auth migrations failed"
  exit 1
fi

echo ""
echo "Step 3/4: Running Knex migrations..."
echo "─────────────────────────────────────────────────"
if NODE_ENV=production yarn db:migrate; then
  echo "✅ Knex migrations completed"
else
  echo "❌ Knex migrations failed"
  exit 1
fi

echo ""
echo "Step 4/4: Seeding database..."
echo "─────────────────────────────────────────────────"
if NODE_ENV=production yarn db:seed; then
  echo "✅ Database seeded"
else
  echo "⚠️  Database seeding failed (this is non-critical)"
fi

echo ""
echo "═══════════════════════════════════════════════════"
echo "✅ Railway database reset completed successfully!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "Verify with:"
echo "  yarn db:check"
