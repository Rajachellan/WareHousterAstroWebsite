# Stage 1: Build
FROM node:lts AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN npm install pnpm --save-dev
RUN npx pnpm install --no-frozen-lockfile
COPY . .
RUN npx pnpm run build

# Stage 2: Serve static files
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
