FROM node:20-alpine

WORKDIR /app

# Copy package.json dulu saja (belum semua kode) — supaya Docker bisa
# cache layer install dependencies, tidak install ulang kalau cuma kode yang berubah
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Baru copy semua kode setelah dependencies terinstall
COPY . .

# Build TypeScript jadi JavaScript
RUN pnpm build

EXPOSE 4001

CMD ["pnpm", "start"]