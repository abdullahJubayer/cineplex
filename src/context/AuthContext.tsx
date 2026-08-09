"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Default logged in user for prototype
    const stored = localStorage.getItem("ticketor_user");
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      const defaultUser = {
        id: "usr_demo",
        email: "alex@ticketor.com",
        name: "Alex Rivera",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      };
      setUser(defaultUser);
      localStorage.setItem("ticketor_user", JSON.stringify(defaultUser));
    }
  }, []);

  const login = (email: string) => {
    const newUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 7),
      email,
      name: email.split("@")[0],
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    };
    setUser(newUser);
    localStorage.setItem("ticketor_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ticketor_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
