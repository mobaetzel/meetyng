import {create} from 'zustand';
import {Group} from "../models/group";

const storeKey = '__groups__';


interface AdminState {
    groups: Record<string, Group>;
    addGroup: (group: Group) => void;
}

export const useAdminState = create<AdminState>(
    (set) => ({
        groups: localStorage.getItem(storeKey) != null ? JSON.parse(localStorage.getItem(storeKey)!) : {},
        addGroup: (group) => set((state) => {
            const groups = {
                ...state.groups,
                [group.key]: group,
            }
            localStorage.setItem(storeKey, JSON.stringify(groups));
            return {
                groups: groups,
            };
        }),
    }),
);