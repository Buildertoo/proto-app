# Frontend

React frontend application.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner

## Folder Structure

```
src/
├── components/     # Reusable components
├── pages/          # Page components
├── services/       # API services
├── App.js          # Main application component
├── App.css         # Global styles
├── index.js        # Entry point
└── index.css       # Base styles
```

## Environment Variables

Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:5000
```

## Development

The app will reload when you make changes. You may also see lint errors in the console.

The frontend proxies API requests to the backend server (configured in package.json).
