import { createContext, useContext, useState, useMemo, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [userID, setUserID] = useState(() => localStorage.getItem("userID"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));

  const storeTokenInLS = useCallback((serverToken, userId, userRole) => {
    localStorage.setItem("token", serverToken);
    localStorage.setItem("userID", userId);
    localStorage.setItem("role", userRole);
    setToken(serverToken);
    setUserID(userId);
    setRole(userRole);
  }, []);

  const LogoutUser = useCallback(() => {
    setToken(null);
    setUserID(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    localStorage.removeItem("role");
  }, []);

  const value = useMemo(
    () => ({
      token,
      userID,
      role,
      user: token ? { userID, role } : null,
      isLoggedIn: !!token,
      authorizationToken: token ? `Bearer ${token}` : "",
      storeTokenInLS,
      LogoutUser,
      logout: LogoutUser, // alias
    }),
    [token, userID, role, storeTokenInLS, LogoutUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return authContextValue;
};
