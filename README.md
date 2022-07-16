# Setup
1. Setup Redis
2. Setup PostgreSQL & make account, database (Use db/schema)
3. Set .env (Refer to envSchema of config)
4. Build cosmo-rust image to build contract & Run

# Local Run

```bash
npm start # Run wihtout build for only dev purpose
```
## Local DB setting
```sh
# Initialization
docker run -d -p 5432:5432 --name <pg_container_name> -e POSTGRES_USER=<id> -e POSTGRES_PASSWORD=<pw> postgres
docker run -d -p 6379:6379 --name <redis_container_name> redis

# Attach
docker exec -it <pg_container_name> psql -U <id> -d cosmonaut
docker exec -it <redis_container_name> redis-cli
```

# Docker Compose testbed
## 1) set .env
```sh
HOST_ADDR=0.0.0.0
PORT=3334
LOCAL_RUST_SET=false
SESS_SECRET=YOURSECRETKEYGOESHERE
PGHOST=pgdb
PGPORT=5432
PGUSER=ljs
PGPASSWORD=secret
PGDATABASE=cosmonaut
REDISHOST=redis-sess
REDISPORT=6379
REQ_TIMEOUT=5000
RUST_TIMEOUT=4000
TS_NODE_PROJECT=./tsconfig.prod.json
FRONT_HOST_ADDR="http://127.0.0.1:8080"
FRONT_MAIN_ADDR="http://127.0.0.1:8080"
FRONT_LOGIN_ADDR="http://127.0.0.1:8080/signUp"
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```
## 2) build cosmo-rust image
```sh
docker build -f compose.rust.Dockerfile -t cosmo-rust:dind .
docker compose build
```

## 3) Use docker compose to serve
```sh
docker compose up # start app
docker compose down # stop app
```

## 4) Serve react-front
```sh
# go to cosmonaut-frontend
docker compose build
docker up
```

# Flow
```sh
docker run -it --rm --volumes-from cosmonaut-api-1 -w /workspace cosmo-rust:dind bash
make cosm-init TARGET_PATH="cosm/github-111/lesson1/ch5"
make cosm-build TARGET_PATH="/workspace/cargo-projects/cosm/github-111/lesson1/ch5"

# static serve
docker run --rm -p 8080:80 -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro cosmo-nginx
```