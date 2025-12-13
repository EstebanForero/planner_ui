FROM oven/bun:latest AS deps
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

FROM oven/bun:latest AS builder
WORKDIR /app

ENV NODE_ENV=production
# Used at build time so the frontend bundle points to the correct backend.
ARG BACKEND_URL=http://localhost:8080
ENV NEXT_PUBLIC_BACKEND_URL=${BACKEND_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun run build

FROM oven/bun:latest AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ARG BACKEND_URL=http://localhost:8080
ENV NEXT_PUBLIC_BACKEND_URL=${BACKEND_URL}

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
COPY next.config.ts ./
COPY tsconfig.json ./

EXPOSE 3000

CMD ["bun", "run", "start"]
