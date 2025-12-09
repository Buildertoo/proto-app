# Backend

Express.js backend API server.

## Available Scripts

- `npm start` - Start the server
- `npm run dev` - Start with nodemon (auto-reload on changes)

## Folder Structure

```
backend/
├── controllers/    # Request handlers (business logic)
├── routes/         # API route definitions
├── middleware/     # Custom middleware functions
├── utils/          # Helper functions
└── server.js       # Server entry point
```

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
NODE_ENV=development
```

## API Documentation

### Data Endpoints

**GET /api/data**
- Get all data items
- Response: `{ message, items, count }`

**GET /api/data/:id**
- Get specific data item by ID
- Response: `{ id, name, description }`

**POST /api/data**
- Create new data item
- Body: `{ name, description? }`
- Response: `{ message, item }`

**PUT /api/data/:id**
- Update existing data item
- Body: `{ name?, description? }`
- Response: `{ message, item }`

**DELETE /api/data/:id**
- Delete data item
- Response: `{ message, item }`

### Health Check

**GET /health**
- Server health check
- Response: `{ status, message }`

## Development

The server uses nodemon in development mode, which automatically restarts when you save changes.
