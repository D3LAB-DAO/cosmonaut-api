FROM node AS builder
WORKDIR /workspace
COPY src ./src
COPY package.json package-lock.json .env.compose tsconfig.prod.json ./
RUN npm ci
RUN npm run build

FROM node
WORKDIR /workspace
RUN apt-get update && apt-get install docker.io -y
COPY cargo-projects ./cargo-projects
COPY package.json package-lock.json .env.compose Makefile tsconfig.prod.json pm2-env.json ./
RUN npm ci --omit=dev
COPY --from=builder /workspace/dist/src ./dist/src
CMD ["npm", "run", "pm2:dev"]