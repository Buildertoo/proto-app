import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { initializeCsrfToken } from './services/api';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CarouselPage from './pages/CarouselPage';
import ListPage from './pages/ListPage';
import MyUploads from './pages/MyUploads';

function App() {
  useEffect(() => {
    // Initialize CSRF token on app load
    initializeCsrfToken();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/carousel" element={<CarouselPage />} />
            <Route path="/list" element={<ListPage />} />
            <Route path="/my-uploads" element={<MyUploads />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
