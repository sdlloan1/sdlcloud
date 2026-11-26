import React, { createContext, useState, useContext, useEffect } from "react";
import { db } from "@/api/base44Client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAppState();
  }, []);

  // The app's Worker owns sign-in, so app state is simply "is there a session".
  const checkAppState = async () => {
    setIsLoadingPublicSettings(true);
    setAuthError(null);
    try {
      const currentUser = await db.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      if (error.status === 403) {
        setAuthError({ type: "user_not_registered", message: "User not registered for this app" });
      } else if (error.status && error.status !== 401) {
        setAuthError({ type: "unknown", message: error.message || "Failed to load app" });
      }
    } finally {
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const currentUser = await db.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setAuthError(null);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      if (error.status === 403) {
        setAuthError({ type: "user_not_registered", message: "User not registered for this app" });
      }
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    db.auth.logout(shouldRedirect ? "/login" : undefined);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await db.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (e) {
      console.error("refreshUser failed", e);
    }
  };

  const navigateToLogin = () => {
    db.auth.redirectToLogin(window.location.href);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings: null,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
