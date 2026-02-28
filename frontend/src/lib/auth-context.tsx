'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  email_verified?: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string; role?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
}

interface RegisterData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Store the initial server version to detect backend changes
let initialServerVersion: string | null = null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
      });

      // Check for server version changes (backend restart detection)
      // Only enable in production to avoid dev mode reload loops
      if (process.env.NODE_ENV === 'production') {
        const serverVersion = response.headers.get('x-server-version');
        if (serverVersion) {
          if (initialServerVersion === null) {
            initialServerVersion = serverVersion;
          } else if (initialServerVersion !== serverVersion) {
            // Backend has changed, reload the page
            console.log('Backend version changed, reloading page...');
            window.location.reload();
            return;
          }
        }
      }

      const rawText = await response.text();
      let data: any = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch {
        console.error('Failed to parse session response as JSON:', rawText.slice(0, 120));
        setUser(null);
        return;
      }

      if (!response.ok) {
        setUser(null);
        return;
      }

      if (data?.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listen for visibility changes to refresh session when user returns to page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshSession]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const rawText = await response.text();
      let data: any = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        const messageFromServer = (data && data.error) || rawText;
        const missingEnv = Array.isArray(data?.missingEnv) ? data.missingEnv.join(', ') : null;
        const fallbackMessage = response.status === 503
          ? `Backend is not fully configured (${missingEnv ? `missing: ${missingEnv}` : 'set JWT_SECRET and DATABASE_URL on backend'}).`
          : 'Login failed';
        return {
          success: false,
          error:
            (typeof messageFromServer === 'string' && messageFromServer.trim())
              ? messageFromServer
              : fallbackMessage,
        };
      }

      setUser(data?.user || null);
      return { success: true, role: data?.user?.role };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(registerData),
      });

      const rawText = await response.text();
      let data: any = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        const messageFromServer = (data && data.error) || rawText;
        const missingEnv = Array.isArray(data?.missingEnv) ? data.missingEnv.join(', ') : null;
        const fallbackMessage = response.status === 503
          ? `Backend is not fully configured (${missingEnv ? `missing: ${missingEnv}` : 'set JWT_SECRET and DATABASE_URL on backend'}).`
          : 'Registration failed';
        return {
          success: false,
          error:
            (typeof messageFromServer === 'string' && messageFromServer.trim())
              ? messageFromServer
              : fallbackMessage,
        };
      }

      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/session', {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to send reset email' };
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to reset password' };
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const rawText = await response.text();
      let data: any = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        const messageFromServer = (data && data.error) || rawText;
        return {
          success: false,
          error:
            (typeof messageFromServer === 'string' && messageFromServer.trim())
              ? messageFromServer
              : 'Failed to send verification email',
        };
      }

      return { success: true, message: (data && data.message) || rawText };
    } catch (error) {
      console.error('Resend verification error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshSession,
        forgotPassword,
        resetPassword,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
