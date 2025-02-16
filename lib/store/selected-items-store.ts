import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SelectedNewsItem {
    id: string;
    title: string;
    newsletterId: string;
    date: string;
    content: string;
}

interface SelectedItemsState {
    selectedItems: SelectedNewsItem[];
    addItem: (item: SelectedNewsItem) => void;
    removeItem: (itemId: string) => void;
    clearItems: () => void;
    hasItem: (itemId: string) => boolean;
}

export const useSelectedItemsStore = create<SelectedItemsState>()(
    persist(
        (set, get) => ({
            selectedItems: [],
            addItem: (item) => set((state) => {
                // Don't add if already exists
                if (state.selectedItems.some(existing => existing.id === item.id)) {
                    return state;
                }
                return {
                    selectedItems: [...state.selectedItems, item]
                };
            }),
            removeItem: (itemId) => set((state) => ({
                selectedItems: state.selectedItems.filter((item) => item.id !== itemId)
            })),
            clearItems: () => set({ selectedItems: [] }),
            hasItem: (itemId) => get().selectedItems.some((item) => item.id === itemId),
        }),
        {
            name: 'selected-items-storage',
        }
    )
); 