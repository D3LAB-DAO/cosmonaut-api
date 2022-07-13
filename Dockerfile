FROM node AS builder
WORKDIR /workspace
ENV NODE_ENV=development
COPY src ./src
COPY package.json package-lock.json .env tsconfig.prod.json ./
RUN npm ci
RUN npm run build

FROM node
WORKDIR /workspace
RUN apt-get update && apt-get install docker.io -y
COPY cargo-projects ./cargo-projects
COPY package.json package-lock.json Makefile tsconfig.prod.json pm2-env.json ./
RUN npm install pm2 -g
RUN npm ci --omit=dev
COPY --from=builder /workspace/dist/src ./dist/src
CMD ["pm2-runtime", "start", "pm2-env.json", "--name", "cosmonaut-api", "--env", "development"]