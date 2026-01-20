# ---------- Build stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only package files first (better caching)
COPY package.json package-lock.json* ./

RUN npm ci

# Copy rest of the source
COPY . .

# Build Next.js app
RUN npm run build


# ---------- Production stage ----------
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only required files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]
