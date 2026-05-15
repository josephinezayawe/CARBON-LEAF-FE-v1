# =============================================================================
# Frontend Dockerfile — Multi-stage Next.js production build
# =============================================================================

FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache curl

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# ========================================
# Production stage
# ========================================
FROM node:20-alpine AS production

RUN apk add --no-cache dumb-init curl

RUN addgroup -g 1001 -S appgroup && \
    adduser -S nextuser -G appgroup -u 1001

WORKDIR /app

COPY --from=builder /app/.next/standalone/ ./
COPY --from=builder /app/.next/static/ ./.next/static
COPY --from=builder /app/public/ ./public

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

USER nextuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD ["curl", "-sf", "http://localhost:3000/_next/static"] || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]