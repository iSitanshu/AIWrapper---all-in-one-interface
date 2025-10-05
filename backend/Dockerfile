# Use the official Bun image as a base
FROM oven/bun:1.1.8

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and bun.lockb to leverage Docker layer caching
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on (Elysia's default is 3000)
EXPOSE 3000

# The command to run your application
CMD ["bun", "start"]