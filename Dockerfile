# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the app (runs ETL first, then Next.js build)
RUN npm run build

# Production stage - static file server
FROM nginx:alpine AS production

# Copy built static files
COPY --from=builder /app/out /usr/share/nginx/html

# Copy nginx config
COPY config/nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
