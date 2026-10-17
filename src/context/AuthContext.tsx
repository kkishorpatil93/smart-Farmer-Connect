'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, FarmerProfile, SellerProfile } from '@/types/database';

export interface AuthUser {
  profile: Profile;
  farmerProfile?: FarmerProfile | null;
  sellerProfile?: (SellerProfile & { subscribedMarkets: string[] }) | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  quickLogin: (role: 'farmer' | 'seller') => Promise<boolean>;
  logout: () => void;
  register: (data: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  quickLogin: async () => false,
  logout: () => {},
  register: async () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sfc_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading stored auth user', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveUserSession = (authUser: AuthUser) => {
    setUser(authUser);
    localStorage.setItem('sfc_user', JSON.stringify(authUser));
  };

  const login = async (phone: string, otp: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      saveUserSession({
        profile: data.profile,
        farmerProfile: data.farmerProfile,
        sellerProfile: data.sellerProfile,
      });
      return true;
    } catch (err: any) {
      alert(err.message || 'Login failed');
      return false;
    }
  };

  const quickLogin = async (role: 'farmer' | 'seller') => {
    const phone = role === 'farmer' ? '+919845011111' : '+919845044444';
    return await login(phone, '123456');
  };

  const register = async (formData: any) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      saveUserSession({
        profile: data.profile,
        farmerProfile: data.farmerProfile,
        sellerProfile: data.sellerProfile,
      });
      return true;
    } catch (err: any) {
      alert(err.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sfc_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, quickLogin, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
