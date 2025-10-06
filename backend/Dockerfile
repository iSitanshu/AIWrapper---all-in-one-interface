# Use official Bun base image
FROM oven/bun:latest

# Install OpenSSL for Prisma (CRITICAL FIX)
RUN apt-get update && apt-get install -y openssl

# Set working directory
WORKDIR /app

# Copy package and lock first (for better caching)
COPY package.json bun.lock* ./

# Install dependencies (production only)
RUN bun install

# Copy Prisma schema first so prisma generate can be cached
COPY prisma ./prisma

# Generate Prisma client
RUN bunx prisma generate || true

# Copy the rest of your code
COPY . .

# Copy entrypoint script (to handle migrate + start)
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
CMD ["/entrypoint.sh"]