'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch, safeParseJson } from '../api';

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: 'student' | 'citizen' | 'farmer' | 'admin' | 'superadmin' | string;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'all';
  state: string;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority' | 'All';
  annualIncome: number;
  occupation: string;
  educationLevel: '10th' | '12th' | 'Diploma' | 'Undergraduate' | 'Postgraduate' | 'Doctorate' | 'None' | 'Other';
  currentCourse?: string;
  currentSemester?: number;
  cgpaOrPercentage?: number;
  skills: string[];
  targetCareerGoal?: string;
  disability: boolean;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { email: string; password: string; phone?: string; role?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  saveProfile: (profileData: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('saarthi_token');
    if (storedToken) {
      setToken(storedToken);
      fetchSession(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function fetchSession(authToken: string) {
    try {
      const res = await apiFetch('/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const { data } = await safeParseJson(res);
        if (data && data.user) {
          setUser(data.user);
          setProfile(data.profile || null);
        } else {
          localStorage.removeItem('saarthi_token');
          setToken(null);
          setUser(null);
          setProfile(null);
        }
      } else {
        localStorage.removeItem('saarthi_token');
        setToken(null);
        setUser(null);
        setProfile(null);
      }
    } catch {
      // Offline fallback: keep token but mark loading complete
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const { data, text } = await safeParseJson(res);
      if (!res.ok) {
        const errorMsg = data?.message || data?.error || text || `Login failed (${res.status})`;
        return { success: false, error: errorMsg };
      }
      if (!data?.token) {
        return { success: false, error: 'Authentication server did not return a valid session token.' };
      }
      localStorage.setItem('saarthi_token', data.token);
      setToken(data.token);
      setUser(data.user);
      await fetchSession(data.token);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: 'Could not connect to authentication server. Please ensure the backend is running at http://localhost:4000 (npm run dev:backend).'
      };
    }
  }

  async function signup(data: { email: string; password: string; phone?: string; role?: string }) {
    try {
      const res = await apiFetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const { data: resData, text } = await safeParseJson(res);
      if (!res.ok) {
        const errorMsg = resData?.message || resData?.error || text || `Registration failed (${res.status})`;
        return { success: false, error: errorMsg };
      }
      if (!resData?.token) {
        return { success: false, error: 'Registration succeeded but no session token was issued.' };
      }
      localStorage.setItem('saarthi_token', resData.token);
      setToken(resData.token);
      setUser(resData.user);
      await fetchSession(resData.token);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: 'Could not connect to authentication server. Please ensure the backend is running at http://localhost:4000 (npm run dev:backend).'
      };
    }
  }

  function logout() {
    localStorage.removeItem('saarthi_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  }

  async function saveProfile(profileData: Partial<UserProfile>) {
    if (!token) {
      return { success: false, error: 'Authentication required' };
    }
    try {
      const res = await apiFetch('/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      const { data, text } = await safeParseJson(res);
      if (!res.ok) {
        return { success: false, error: data?.message || data?.error || text || 'Failed to save profile' };
      }
      setProfile(data.profile);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Could not update profile' };
    }
  }

  async function refreshUser() {
    if (token) {
      await fetchSession(token);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        saveProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
