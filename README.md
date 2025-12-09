# React Fullstack Application

A modern full-stack web application with React frontend and Node.js/Express backend.

## Project Structure

```
Proto Apps/
├── frontend/              # React frontend application
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   ├── App.js        # Main App component
│   │   └── index.js      # Entry point
│   └── package.json
├── backend/              # Node.js/Express backend
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Helper functions
│   ├── server.js         # Server entry point
│   └── package.json
└── package.json          # Root package.json
```

## Features

### Frontend
- ⚛️ React 18 with functional components and hooks
- 🛣️ React Router for navigation
- 🎨 Clean and responsive UI
- 📡 Axios for API requests with interceptors
- 🔧 Environment variable support

### Backend
- 🚀 Express.js server
- 🔄 RESTful API structure
- 🛡️ CORS enabled
- 📝 Morgan logging
- ✅ Input validation middleware
- 🔐 Authentication middleware template

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install all dependencies (root, frontend, and backend):**
   ```bash
   npm run install-all
   ```

   Or install manually:
   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

2. **Set up environment variables:**

   Frontend (.env in frontend folder):
   ```bash
   cp frontend/.env.example frontend/.env
   ```

   Backend (.env in backend folder):
   ```bash
   cp backend/.env.example backend/.env
   ```

### Running the Application

#### Development Mode (Both frontend and backend)
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:5000

#### Run Separately

**Frontend only:**
```bash
npm run dev:frontend
```

**Backend only:**
```bash
npm run dev:backend
```

#### Production Mode

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Start the backend:
   ```bash
   npm start
   ```

## API Endpoints

### Data Endpoints
- `GET /api/data` - Get all data
- `GET /api/data/:id` - Get data by ID
- `POST /api/data` - Create new data
- `PUT /api/data/:id` - Update data
- `DELETE /api/data/:id` - Delete data

### Health Check
- `GET /health` - Server health check

## Development

### Adding New Routes (Backend)

1. Create a new route file in `backend/routes/`
2. Create corresponding controller in `backend/controllers/`
3. Import and use in `backend/server.js`

### Adding New Pages (Frontend)

1. Create new page component in `frontend/src/pages/`
2. Add route in `frontend/src/App.js`
3. Add navigation link in `frontend/src/components/Navbar.js`

### Adding New API Calls (Frontend)

Use the configured axios instance in `frontend/src/services/api.js`:

```javascript
import api from '../services/api';

const fetchData = async () => {
  const response = await api.get('/api/data');
  return response.data;
};
```

## Project Scripts

### Root Level
- `npm run install-all` - Install all dependencies
- `npm run dev` - Run both frontend and backend in development mode
- `npm run dev:frontend` - Run frontend only
- `npm run dev:backend` - Run backend only
- `npm run build` - Build frontend for production
- `npm start` - Start backend server

### Frontend (in frontend/)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Backend (in backend/)
- `npm start` - Start server
- `npm run dev` - Start with nodemon (auto-reload)

## Technologies Used

### Frontend
- React 18
- React Router DOM
- Axios
- React Scripts

### Backend
- Node.js
- Express.js
- CORS
- Morgan
- Dotenv
- Nodemon (dev)

## Next Steps

- [ ] Add database integration (MongoDB, PostgreSQL, etc.)
- [ ] Implement authentication (JWT)
- [ ] Add unit and integration tests
- [ ] Set up CI/CD pipeline
- [ ] Add Docker configuration
- [ ] Implement state management (Redux/Context API)
- [ ] Add form validation
- [ ] Implement error boundaries
- [ ] Add loading states and error handling

## License

ISC
