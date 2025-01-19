import { create } from "zustand";
import { GameSave } from "~frontend/gamesave/GameSave";

interface State {
  gameSave?: GameSave;
}

interface Actions {
  load: (gameSave: GameSave) => void;
  unload: () => void;
}

export const useGameSaveStore = create<State & Actions>()((set) => ({
  gameSave: undefined,

  load(gameSave) {
    set({ gameSave });
  },

  unload() {
    set({ gameSave: undefined });
  },
}));
