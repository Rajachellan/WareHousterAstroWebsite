# Stage 1: Build the Astro app
FROM node:lts AS build
WORKDIR /app

# Copy only package files to leverage Docker caching
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the static site
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine AS runtime

# Copy built static files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom NGINX config
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 4321

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
