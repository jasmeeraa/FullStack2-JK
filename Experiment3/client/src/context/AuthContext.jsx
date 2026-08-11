import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { decodeToken, isTokenValid } from '../utils/jwt';
import { registerUser } from '../utils/userStorage';

const AuthContext = createContext();
const TOKEN_STORAGE_KEY = 'jwt_token';

function getStoredToken() {
  return sessionStorage.getItem(TOKEN_STORAGE_KEY) || '';
}

function getUserFromToken(token) {
  if (!token || !isTokenValid(token)) {
    return null;
  }

  const decoded = decodeToken(token);
  if (!decoded) {
    return null;
  }

  return {
    id: decoded.userId,
    userId: decoded.userId,
    name: decoded.name,
    email: decoded.email,
    role: decoded.role,
  };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [currentUser, setCurrentUser] = useState(() => getUserFromToken(getStoredToken()));

  useEffect(() => {
    const storedToken = getStoredToken();

    if (!storedToken || !isTokenValid(storedToken)) {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken('');
      setCurrentUser(null);
      return;
    }

    const restoredUser = getUserFromToken(storedToken);
    if (restoredUser) {
      setCurrentUser(restoredUser);
    }
  }, []);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);

  const login = (userData, authToken) => {
    const decodedUser = getUserFromToken(authToken);
    const finalUser = decodedUser || userData;

    setCurrentUser(finalUser);
    setToken(authToken);
  };

  const logout = () => {
    setCurrentUser(null);
    setToken('');
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  const register = (userData) => {
    const savedUser = registerUser(userData);
    return savedUser;
  };

  const value = useMemo(
    () => ({
      token,
      currentUser,
      user: currentUser,
      isAuthenticated: Boolean(token && isTokenValid(token)),
      login,
      logout,
      register,
    }),
    [token, currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
