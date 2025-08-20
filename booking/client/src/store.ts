import { create } from 'zustand';

type AuthState = { token: string | null; setToken: (t: string) => void; clear: () => void; };
export const useAuth = create<AuthState>((set) => ({
  token: (typeof localStorage !== 'undefined' && localStorage.getItem('bba_token')) || null,
  setToken: (t) => { localStorage.setItem('bba_token', t); set({ token: t }); },
  clear: () => { localStorage.removeItem('bba_token'); set({ token: null }); }
}));