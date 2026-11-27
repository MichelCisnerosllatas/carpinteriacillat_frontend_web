import { create } from 'zustand'

export interface GoogleUser {
  uid: string
  name: string | null
  email: string | null
  photoUrl: string | null
  emailVerified: boolean
}

interface GoogleAuthState {
  user: GoogleUser | null
  isAuthenticated: boolean

  setUser: (user: GoogleUser) => void
  clearUser: () => void
}

export const useGoogleAuthStore = create<GoogleAuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({
    user,
    isAuthenticated: true,
  }),

  clearUser: () => set({
    user: null,
    isAuthenticated: false,
  }),
}))