import React, { createContext, useState, useContext, useEffect } from 'react';
import { userAPI } from '../services/api';

const AuthContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for stored user on mount or check OAuth session
  useEffect(() => {
    const checkAuthStatus = async () => {
      // First check local storage
      const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        return;
      }

      // Check if user is authenticated via OAuth
      try {
        const response = await fetch(`${API_URL}/auth/status`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          if (data.isAuthenticated && data.user) {
            setUser(data.user);
            setIsAuthenticated(true);
            // Store OAuth user in session storage
            sessionStorage.setItem('currentUser', JSON.stringify(data.user));
          }
        }
      } catch (error) {
        console.log('Error checking auth status:', error);
      }
    };

    checkAuthStatus();

    // Check for OAuth callback success
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'success') {
      checkAuthStatus();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Monitor backend server health
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkServerHealth = async () => {
      try {
        const response = await fetch('/api/health', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
          // Server returned an error, log out the user
          logout();
        }
      } catch (error) {
        // Server is unreachable, log out the user
        console.log('Backend server is offline, logging out user');
        logout();
      }
    };

    // Check server health every 30 seconds
    const interval = setInterval(checkServerHealth, 30000);

    // Initial check
    checkServerHealth();

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const login = async (email, password, stayLoggedIn = false) => {
    try {
      const result = await userAPI.login(email, password);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        
        // Store user in session storage for persistence
        if (stayLoggedIn) {
          localStorage.setItem('currentUser', JSON.stringify(result.user));
        } else {
          sessionStorage.setItem('currentUser', JSON.stringify(result.user));
        }
        
        return { success: true, user: result.user };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Invalid email or password';
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (userData, stayLoggedIn = false) => {
    try {
      const result = await userAPI.register(userData);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        
        // Store user in session storage for persistence
        if (stayLoggedIn) {
          localStorage.setItem('currentUser', JSON.stringify(result.user));
        } else {
          sessionStorage.setItem('currentUser', JSON.stringify(result.user));
        }
        
        return { success: true, user: result.user };
      }
      
      return { success: false, error: 'Signup failed' };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'User already exists with this email or username';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    
    // If user was logged in via OAuth, call backend logout
    fetch(`${API_URL}/auth/logout`, {
      credentials: 'include',
    }).catch(err => console.log('Logout error:', err));
  };

  const loginWithOAuth = (provider) => {
    // Redirect to OAuth provider
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    loginWithOAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
