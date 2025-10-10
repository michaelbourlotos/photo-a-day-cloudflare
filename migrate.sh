#!/bin/bash

# Photo A Day Migration Script
# This script helps migrate data from the original MySQL database to Cloudflare D1

echo "Photo A Day Migration Script"
echo "============================"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "Error: Wrangler CLI is not installed."
    echo "Please install it with: npm install -g wrangler"
    exit 1
fi

# Check if user is logged in
if ! wrangler whoami &> /dev/null; then
    echo "Error: Not logged in to Cloudflare."
    echo "Please run: wrangler login"
    exit 1
fi

echo "Step 1: Creating D1 database..."
DB_OUTPUT=$(wrangler d1 create photo-a-day-db)
DB_ID=$(echo "$DB_OUTPUT" | grep -o 'database_id = "[^"]*"' | cut -d'"' -f2)

if [ -z "$DB_ID" ]; then
    echo "Error: Failed to create database or extract database ID"
    exit 1
fi

echo "Database created with ID: $DB_ID"
echo ""

echo "Step 2: Updating wrangler.toml with database ID..."
sed -i.bak "s/your-database-id-here/$DB_ID/g" wrangler.toml
echo "Updated wrangler.toml"
echo ""

echo "Step 3: Running database migrations..."
wrangler d1 migrations apply photo-a-day-db
echo "Database schema created"
echo ""

echo "Step 4: Creating R2 bucket..."
wrangler r2 bucket create photo-a-day-images
echo "R2 bucket created"
echo ""

echo "Migration setup complete!"
echo ""
echo "Next steps:"
echo "1. Upload your images to the R2 bucket"
echo "2. Update database/migrate.sql with your photo data"
echo "3. Run: wrangler d1 execute photo-a-day-db --file=./database/migrate.sql"
echo "4. Update R2_PUBLIC_URL in wrangler.toml"
echo "5. Deploy with: wrangler pages deploy"
echo ""
echo "Database ID: $DB_ID"
echo "Bucket name: photo-a-day-images"
