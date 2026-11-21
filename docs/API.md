# API

All query inputs are validated before database access where applicable. Successful responses use:

```json
{ "data": {}, "error": null }
```

Failures use:

```json
{ "data": null, "error": { "code": "ERROR_CODE", "message": "Description" } }
```

Model discovery supports `q`, `company`, `provider`, `capability`, `type`, `sort`, `order`, `page`, and `limit`.
