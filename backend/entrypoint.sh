#!/usr/bin/env bash
set -euo pipefail

echo "Generating Prisma client..."
bunx prisma generate || true

echo "Running migrations..."
until bunx prisma migrate deploy; do
  echo "Database not ready yet. Retrying in 2s..."
  sleep 2
done

echo "Starting backend..."
exec bun index.ts
