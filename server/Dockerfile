# # ---------- Build stage ----------
# FROM node:22-alpine AS builder

# WORKDIR /app

# COPY package.json package-lock.json ./

# RUN npm install --legacy-peer-deps

# COPY . .

# RUN npm run build


# # ---------- Production stage ----------
# FROM node:22-alpine

# WORKDIR /app

# COPY package.json package-lock.json ./

# RUN npm install --legacy-peer-deps

# COPY --from=builder /app/dist ./dist

# EXPOSE 3000

# CMD ["node", "dist/index.js"]

# ---------- Build stage ----------
FROM node:22-alpine AS builder

# Install build tools AND pip for mediasoup
RUN apk add --no-cache python3 py3-pip make g++ gcc linux-headers

WORKDIR /app

COPY package.json package-lock.json ./

# Install all dependencies
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# ---------- Production stage ----------
FROM node:22-alpine

# Production also needs these for native modules like mediasoup
RUN apk add --no-cache python3 py3-pip make g++ gcc linux-headers

WORKDIR /app

COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --omit=dev --legacy-peer-deps

# Copy the compiled code
COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/index.js"]