# Run

```bash
npm start
```

# .env

```
PORT=3000
MODE=development
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