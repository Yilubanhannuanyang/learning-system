// ============================================================
// useAuth Hook - 认证状态管理
// ============================================================
import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { supabase, type User, type UserSettings } from '../lib/supabase';
import type { AppPage } from '../types';

interface AuthContextType {
  user: User | null;
  settings: UserSettings | null;
  loading: boolean;
  page: AppPage;
  setPage: (p: AppPage) => void;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  loadSettings: () => Promise<void>;
  updateSettings: (s: Partial<UserSettings>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<AppPage>('dashboard');

  const loadSettings = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();
    if (data) setSettings(data as UserSettings);
    else {
      // 创建默认设置
      const { data: newSettings } = await supabase
        .from('user_settings')
        .insert({ user_id: user.id, start_date: '2026-05-09', reminder_enabled: false, reminder_hour: 8 })
        .select()
        .single();
      if (newSettings) setSettings(newSettings as UserSettings);
    }
  }, [user]);

  const updateSettings = useCallback(async (updates: Partial<UserSettings>) => {
    if (!user || !settings) return;
    const { data } = await supabase
      .from('user_settings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select()
      .single();
    if (data) setSettings(data as UserSettings);
  }, [user, settings]);

  const signIn = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    setUser(data.user as unknown as User);
    return null;
  }, []);

  const signUp = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;
    if (data.user) setUser(data.user as unknown as User);
    return null;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSettings(null);
    setPage('login');
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) loadSettings();
    else setSettings(null);
  }, [user, loadSettings]);

  return (
    <AuthContext.Provider value={{ user, settings, loading, page, setPage, signIn, signUp, signOut, loadSettings, updateSettings }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
