FROM node:22-alpine AS frontend-builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Backend build stage
FROM node:22-alpine AS backend-builder

WORKDIR /app

# Copy server package files
COPY server/package*.json ./server/
COPY server/tsconfig.json ./server/

# Install server dependencies
WORKDIR /app/server
RUN npm ci

# Copy server source and build
COPY server/src ./src
RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S eurovision -u 1001

# Copy server production dependencies and built code
COPY server/package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=backend-builder /app/server/dist ./dist

# Copy frontend build files
COPY --from=frontend-builder /app/dist ./dist/public

# Create .env file template
RUN echo "NODE_ENV=production" > .env.example

# Change ownership to nodejs user
RUN chown -R eurovision:nodejs /app
USER eurovision

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

EXPOSE 3000

CMD ["dumb-init", "node", "dist/index.js"]
