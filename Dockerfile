FROM node AS builder
WORKDIR /workspace
ENV NODE_ENV=development
COPY src ./src
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.prod.json .env ./
RUN npm run build

FROM node
WORKDIR /workspace
RUN apt-get update && apt-get install docker.io -y
RUN npm install pm2 -g
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /workspace/dist/src ./dist/src
COPY cargo-projects ./cargo-projects
COPY pm2-env.json Makefile tsconfig.prod.json ./

CMD ["pm2-runtime", "start", "pm2-env.json", "--name", "cosmonaut-api", "--env", "development"]