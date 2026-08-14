'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserMembership } from '@/lib/types';

interface AuthContextType {
  user: UserProfile | null;
  membership: UserMembership | null;
  isPremium: boolean;
  isLoading: boolean;
  loginWithGoogle: (email?: string, name?: string, avatar_url?: string, google_id?: string) => Promise<UserProfile>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [membership, setMembership] = useState<UserMembership | null>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initAuth() {
      if (typeof window !== 'undefined') {
        const savedUserStr = localStorage.getItem('lovetalk_auth_user');
        if (savedUserStr) {
          try {
            const parsed = JSON.parse(savedUserStr);
            setUser(parsed);
            await fetchSession(parsed.id);
          } catch (e) {
            console.warn('Failed to parse auth user:', e);
          }
        }
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const fetchSession = async (userId: string) => {
    try {
      const res = await fetch(`/api/auth/me?userId=${userId}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setUser(json.user);
          setMembership(json.membership);
          setIsPremium(json.isPremium);
          if (typeof window !== 'undefined') {
            localStorage.setItem('lovetalk_auth_user', JSON.stringify(json.user));
          }
        }
      }
    } catch (err) {
      console.warn('Failed to sync session with MySQL API:', err);
    }
  };

  const loginWithGoogle = async (
    customEmail?: string, 
    customName?: string,
    customAvatar?: string,
    customGoogleId?: string
  ): Promise<UserProfile> => {
    setIsLoading(true);

    const email = customEmail || 'listener@lovetalkpodcast.in';
    const name = customName || (email.split('@')[0]);
    const avatar_url = customAvatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`;
    const google_id = customGoogleId || `google_${Date.now()}`;

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, avatar_url, google_id })
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Authentication failed');
      }

      setUser(json.user);
      setMembership(json.membership);
      setIsPremium(json.isPremium);

      if (typeof window !== 'undefined') {
        localStorage.setItem('lovetalk_auth_user', JSON.stringify(json.user));
      }

      setIsLoading(false);
      return json.user;
    } catch (err: any) {
      console.error('Login error:', err);
      setIsLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setMembership(null);
    setIsPremium(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lovetalk_auth_user');
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...data })
      });

      const json = await res.json();
      if (json.success && json.user) {
        setUser(json.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('lovetalk_auth_user', JSON.stringify(json.user));
        }
      }
    } catch (err) {
      console.error('Failed to update profile via API:', err);
    }
  };

  const refreshSession = async () => {
    if (user) {
      await fetchSession(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        membership,
        isPremium,
        isLoading,
        loginWithGoogle,
        logout,
        updateProfile,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
