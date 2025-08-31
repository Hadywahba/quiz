import { create } from 'zustand';
import Cookies from 'js-cookie';

interface User {
  id: string;
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
}

interface AuthState {
  user: User;
  setEmail: (email: string) => void;
  setUser: (user: User) => void;
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

const initialState = {
  id: '',
  fullName: '',
  email: '',
  countryCode: '',
  phone: '',
};

const authStore = create<AuthState>((set) => ({
  user: initialState,

  setEmail: (email) =>
    set((state) => ({
      user: { ...state.user, email },
    })),

  setUser: (user) =>
    set(() => ({
      user,
    })),
  token: Cookies.get('flmadmonAuthToken') || null,
  setToken: (token) => {
    Cookies.set('flmadmonAuthToken', token, {
      expires: 7,
      // secure: true,
      secure: location.protocol === 'https:',

      sameSite: 'lax',
    });
    set({ token });
  },
  clearToken: () => {
    Cookies.remove('flmadmonAuthToken');
    set({ token: null });
  },
}));

export default authStore;
