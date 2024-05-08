import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface State {
  revealed: string[];
}

interface Actions {
  reveal: (sectionId: string) => void;
  hide: (sectionId: string) => void;
}

export const useSpoilersStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      revealed: [],

      reveal: (sectionId) =>
        set((state) => {
          state.revealed.push(sectionId);
        }),
      hide: (sectionId) =>
        set((state) => {
          state.revealed = state.revealed.filter((v) => v !== sectionId);
        }),
    })),
    {
      name: "spoilers",
    }
  )
);
