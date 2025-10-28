# Stage 1: Base image
FROM node:lts AS base
WORKDIR /app

# Copy package files first for caching
COPY package.json pnpm-lock.yaml* ./

# Stage 2: Install dependencies
FROM base AS deps
# Install a fixed pnpm version
RUN npm install -g pnpm@10.19.0

# Create pnpm store directory for caching
RUN mkdir -p /root/.pnpm-store

# Install dependencies with reduced concurrency to avoid worker exits
RUN pnpm install --store /root/.pnpm-store --no-frozen-lockfile --network-concurrency 1

# Stage 3: Build app
FROM deps AS build
COPY . .
RUN pnpm run build

# Stage 4: Runtime
FROM node:lts AS runtime
WORKDIR /app

# Copy dependencies & build artifacts
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
