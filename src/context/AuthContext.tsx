"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role?: "ADMIN" | "USER") => void;
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
    const stored = localStorage.getItem("ticketor_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const login = (email: string, customRole?: "ADMIN" | "USER") => {
    const isAdmin = customRole === "ADMIN" || email.includes("admin") || email === "alex@ticketor.com";
    const newUser: User = {
      id: "usr_" + Math.random().toString(36).substring(2, 7),
      email,
      name: email.split("@")[0],
      role: isAdmin ? "ADMIN" : "USER",
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
