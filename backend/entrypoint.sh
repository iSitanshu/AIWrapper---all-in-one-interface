#!/bin/sh
# Exit immediately if a command fails
set -e

echo "=== Starting Application ==="

echo "1. Generating Prisma client..."
bunx prisma generate

echo "2. Running migrations..."
bunx prisma migrate deploy

echo "3. Starting backend..."
exec bun start
