import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth as authApi } from '../api/api';
import { getToken, setToken, clearToken } from '../utils/auth';

// Create context
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken();
        if (token) {
          const userData = await authApi.me();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const { token, user } = await authApi.login(credentials);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const { token, user } = await authApi.register(userData);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearToken();
      setUser(null);
      navigate('/login');
    }
  };

  // Context value
  const value = {
    isAuthenticated: !!user,
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Higher Order Component for protecting routes
export const withAuth = (Component) => {
  return (props) => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        navigate('/login', { replace: true, state: { from: window.location.pathname } });
      }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
      return <div>Loading...</div>; // Or a loading spinner
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };
};

export default AuthContext;
