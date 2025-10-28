# Stage 1: Base image
FROM node:lts AS base
WORKDIR /app

# Copy only package files
COPY package.json pnpm-lock.yaml* ./

# Stage 2: Install dependencies
FROM base AS deps
RUN npm install pnpm --save-dev
RUN npx pnpm install --no-frozen-lockfile

# Stage 3: Build app
FROM deps AS build
COPY . .  # now safe, node_modules not copied from host
RUN npx pnpm run build

# Stage 4: Runtime
FROM node:lts AS runtime
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
