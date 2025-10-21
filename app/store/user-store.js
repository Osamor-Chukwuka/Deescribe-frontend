import { create } from "zustand";
import { persist } from 'zustand/middleware'

export const useUserStore = create(
    persist(
        (set) => ({
            user: null,

            hasHydrated: false,

            setUser: (newUser) => set({ user: newUser }),

            clearUser: () => set({ user: null }),

            setHasHydrated: (value) => set({ hasHydrated: value })
        }),
        {
            name: 'user-store',
            onRehydrateStorage: () => (state) => {
                state.setHasHydrated(true);
            },
        }
    )
)