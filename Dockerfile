FROM node AS builder
WORKDIR /workspace
ENV NODE_ENV=development
COPY src ./src
COPY package.json package-lock.json tsconfig.prod.json .env ./
RUN npm ci
RUN npm run build

FROM node
WORKDIR /workspace
RUN apt-get update && apt-get install docker.io -y
COPY package.json package-lock.json tsconfig.prod.json pm2-env.json Makefile ./
RUN npm install pm2 -g
RUN npm ci --omit=dev
COPY --from=builder /workspace/dist/src ./dist/src
COPY cargo-projects ./cargo-projects
CMD ["pm2-runtime", "start", "pm2-env.json", "--name", "cosmonaut-api", "--env", "development"]