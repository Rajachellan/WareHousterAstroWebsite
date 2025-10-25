# ---------------------------
# 1. Build stage
# ---------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json pnpm-lock.yaml* ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the Astro site
RUN pnpm run build

# ---------------------------
# 2. Serve stage
# ---------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Install static file server
RUN npm install -g serve

# Copy built assets
COPY --from=builder /app/dist ./dist

EXPOSE 4321

CMD ["serve", "-s", "dist", "-l", "4321"]
