# API Documentation

This document outlines the internal API routes used by the Apify Web Interface to communicate with the Apify platform.

## Base URL

All API routes are relative to your application's base URL (e.g., `http://localhost:3000` in development).

## Authentication

All API requests require the `x-apify-api-key` header containing a valid Apify API token.

```javascript
headers: {
  'x-apify-api-key': 'your-apify-api-key-here'
}
```

## Endpoints

### 1. Get Actors

**Endpoint**: `GET /api/actors`

**Description**: Retrieves a list of available actors from your Apify account.

**Headers**:

- `x-apify-api-key`: Required. Your Apify API token.

**Response**:

```json
{
  "data": {
    "total": 150,
    "offset": 0,
    "limit": 1000,
    "desc": false,
    "count": 150,
    "items": [
      {
        "id": "username/actor-name",
        "name": "actor-name",
        "username": "username",
        "title": "Actor Title",
        "description": "Actor description...",
        "isPublic": true,
        "categories": ["ECOMMERCE", "SCRAPER"],
        "stats": {
          "totalRuns": 1000,
          "totalUsers": 50
        }
      }
    ]
  }
}
```

**Error Responses**:

- `401`: Missing or invalid API key
- `500`: Server error

---

### 2. Get Actor Schema

**Endpoint**: `GET /api/schema?actorId={actorId}`

**Description**: Retrieves detailed information about a specific actor including its schema and metadata.

**Parameters**:

- `actorId`: The ID of the actor (e.g., "username/actor-name")

**Headers**:

- `x-apify-api-key`: Required. Your Apify API token.

**Response**:

```json
{
  "data": {
    "id": "username/actor-name",
    "name": "actor-name",
    "username": "username",
    "title": "Actor Title",
    "description": "Detailed description...",
    "exampleRunInput": {
      "body": "{\"startUrls\":[{\"url\":\"https://example.com\"}]}",
      "contentType": "application/json"
    },
    "defaultRunOptions": {
      "timeoutSecs": 3600,
      "memoryMbytes": 1024
    },
    "pictureUrl": "https://...",
    "categories": ["ECOMMERCE"],
    "stats": {
      "totalRuns": 1000,
      "totalUsers": 50,
      "publicActorRunStats30Days": {
        "SUCCEEDED": 950,
        "FAILED": 50
      }
    }
  }
}
```

---

### 3. Run Actor

**Endpoint**: `POST /api/run`

**Description**: Starts an actor run with the provided input.

**Headers**:

- `x-apify-api-key`: Required. Your Apify API token.
- `Content-Type`: `application/json`

**Request Body**:

```json
{
  "actorId": "username/actor-name",
  "input": {
    "startUrls": [{ "url": "https://example.com" }],
    "maxResults": 100
  }
}
```

**Response**:

```json
{
  "data": {
    "id": "run-id-here",
    "actId": "username/actor-name",
    "status": "RUNNING",
    "startedAt": "2024-01-01T12:00:00.000Z",
    "defaultDatasetId": "dataset-id-here",
    "defaultKeyValueStoreId": "kvs-id-here",
    "options": {
      "memoryMbytes": 1024,
      "timeoutSecs": 3600
    }
  }
}
```

---

### 4. Get Run Status

**Endpoint**: `GET /api/run?runId={runId}`

**Description**: Retrieves the current status and details of a specific actor run.

**Parameters**:

- `runId`: The ID of the run to check

**Headers**:

- `x-apify-api-key`: Required. Your Apify API token.

**Response**:

```json
{
  "data": {
    "id": "run-id-here",
    "status": "SUCCEEDED",
    "startedAt": "2024-01-01T12:00:00.000Z",
    "finishedAt": "2024-01-01T12:05:30.000Z",
    "datasetId": "dataset-id-here",
    "exitCode": 0,
    "stats": {
      "durationMillis": 330000,
      "computeUnits": 0.05,
      "memMaxBytes": 536870912
    },
    "usageTotalUsd": 0.025
  }
}
```

**Status Values**:

- `READY`: Run is ready to start
- `RUNNING`: Run is currently executing
- `SUCCEEDED`: Run completed successfully
- `FAILED`: Run failed with an error
- `ABORTED`: Run was manually aborted
- `TIMED-OUT`: Run exceeded the timeout limit

---

### 5. Get Dataset Results

**Endpoint**: `GET /api/dataset?datasetId={datasetId}`

**Description**: Retrieves the results from a dataset created by an actor run.

**Parameters**:

- `datasetId`: The ID of the dataset

**Headers**:

- `x-apify-api-key`: Required. Your Apify API token.

**Response**:

```json
[
  {
    "url": "https://example.com",
    "title": "Example Page",
    "description": "Page description...",
    "price": "$19.99"
  },
  {
    "url": "https://example.com/product2",
    "title": "Another Product",
    "description": "Another description...",
    "price": "$29.99"
  }
]
```

---

### 6. Get Input Schema

**Endpoint**: `GET /api/input-schema?actorId={actorId}`

**Description**: Retrieves the JSON schema for an actor's input configuration.

**Parameters**:

- `actorId`: The ID of the actor

**Headers**:

- `x-apify-api-key`: Required. Your Apify API token.

**Response**:

```json
{
  "title": "Actor Input Schema",
  "type": "object",
  "schemaVersion": 1,
  "properties": {
    "startUrls": {
      "title": "Start URLs",
      "type": "array",
      "description": "URLs to start scraping from",
      "editor": "requestListSources"
    },
    "maxResults": {
      "title": "Max Results",
      "type": "integer",
      "description": "Maximum number of results to scrape",
      "default": 100
    }
  },
  "required": ["startUrls"]
}
```

## Error Handling

All endpoints return consistent error responses:

**Format**:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes**:

- `400`: Bad Request - Invalid parameters
- `401`: Unauthorized - Missing or invalid API key
- `404`: Not Found - Resource doesn't exist
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server-side error

## Rate Limits

The API respects Apify's rate limits:

- Personal accounts: 200 requests per minute
- Team accounts: 500 requests per minute
- Enterprise accounts: Custom limits

When rate limits are exceeded, the API returns a `429` status code. The application automatically retries with exponential backoff.

## Example Usage

### JavaScript/TypeScript

```typescript
// Get actors
const actors = await fetch("/api/actors", {
  headers: {
    "x-apify-api-key": "your-api-key",
  },
});

// Run actor
const run = await fetch("/api/run", {
  method: "POST",
  headers: {
    "x-apify-api-key": "your-api-key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    actorId: "username/actor-name",
    input: { startUrls: [{ url: "https://example.com" }] },
  }),
});

// Check run status
const status = await fetch(`/api/run?runId=${runId}`, {
  headers: {
    "x-apify-api-key": "your-api-key",
  },
});
```

### cURL

```bash
# Get actors
curl -H "x-apify-api-key: your-api-key" \
     http://localhost:3000/api/actors

# Run actor
curl -X POST \
     -H "x-apify-api-key: your-api-key" \
     -H "Content-Type: application/json" \
     -d '{"actorId":"username/actor-name","input":{"startUrls":[{"url":"https://example.com"}]}}' \
     http://localhost:3000/api/run
```
