FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Tidak ada EXPOSE karena service ini bukan HTTP server,
# dia tidak menerima koneksi masuk dari port manapun
CMD ["pnpm", "start"]