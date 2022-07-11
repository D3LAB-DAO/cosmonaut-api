# Setup
1. Setup Redis
2. Setup PostgreSQL & make account, database
3. Set .env (Refer to envSchema of config)
4. Build cosm-rust image to build contract & Run
```sh
docker build -t cosmo-rust:1.0 .
docker run -it --name jsrust cosmo-rust:1.0
```
# Run

```bash
npm start # Run wihtout build for only dev purpose
make cosm-build OWNER="tkxkd0159" PROJ="ch3" LEC="lesson1"
```
## 1) DB
```sh
# Initialization
docker run -d -p 5432:5432 --name <pg_container_name> -e POSTGRES_PASSWORD=<pw> postgres
docker run -d -p 6379:6379 --name <redis_container_name> redis
# Attach
docker exec -it <pg_container_name> psql -U postgres
docker exec -it <redis_container_name> redis-cli
```

# Flow
```
make cosm-init
npm run dist-test
```
