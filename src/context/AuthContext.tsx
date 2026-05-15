import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Role } from '../types';
import * as api from '../services/api';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  address?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  mode: Role | null;
  setMode: (mode: Role) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('access_token'));
  const [mode, setModeState] = useState<Role | null>(() => localStorage.getItem('app_mode') as Role);
  const [isLoading, setIsLoading] = useState(true);

  const setMode = useCallback((m: Role) => {
    setModeState(m);
    localStorage.setItem('app_mode', m);
  }, []);

  useEffect(() => {
    if (token) {
      api
        .getProfile()
        .then((profile) => {
          const u = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            phone: profile.phone,
            address: profile.address,
          };
          setUser(u);
          if (!mode) setMode(profile.role);
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.login({ email, password });
    localStorage.setItem('access_token', result.token);
    setToken(result.token);
    setUser(result.user);
    setMode(result.user.role);
  }, [setMode]);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('app_mode');
    setToken(null);
    setUser(null);
    setModeState(null);
  }, []);

  const updateUser = useCallback((data: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, mode, setMode, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
