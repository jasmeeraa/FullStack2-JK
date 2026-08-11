import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('jwtToken') || '');
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('jwtUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('jwtToken', token);
    } else {
      sessionStorage.removeItem('jwtToken');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('jwtUser', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('jwtUser');
    }
  }, [user]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken('');
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
