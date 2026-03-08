# API Contract (V1)

POST /api/verify
Request: token
Response:
- verification_result
- consent_status
- events[]

Errors:
400 INVALID_TOKEN
403 CONSENT_REQUIRED
429 RATE_LIMITED
500 SERVER_ERROR
