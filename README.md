# Setup
1. Setup Redis
2. Setup PostgreSQL & make account, database
3. Set .env
# Run

```bash
npm start

docker build -t cosmo-rust:1.0 .
docker run -it --name jsrust cosmo-rust:1.0

make cosm-build OWNER="tkxkd0159" PROJ="ch3" LEC="lesson1"

npx pm2 list
```

# Flow
```
make cosm-init
npm run dist-test
```

# .env

```
PORT=3000
NODE_ENV=development
```

# API

**POST** Do rust fmt  
_Request_

```http request
POST /rust/fmt HTTP/1.1
Host: localhost:3000
Content-Type: application/json

target_rust_code_encoded_with_base64
```

_Response_

```json
{
  "code": "success",
  "result": "Zm4gbWFpbigpIHsKICAgIHByaW50bG4hKCJ0ZXN0IGZ1bmN0aW9uIik7Cn0K"
}
```