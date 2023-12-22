import {create} from 'zustand';

const storeKey = '__name__';

interface UserState {
    name?: string;
    setName: (name: string) => void;
    clearName: () => void;
}

export const useUserState = create<UserState>(
    (set) => ({
        name: localStorage.getItem(storeKey) ?? undefined,
        setName: (name) => set((state) => {
            localStorage.setItem(storeKey, name);
            return {
                name: name,
            };
        }),
        clearName: () => set((state) => {
            localStorage.removeItem(storeKey);
            return {
                name: undefined,
            };
        }),
    }),
);