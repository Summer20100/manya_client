import { create } from 'zustand';

type State = {
  namePage: string;
  namePageRu: string;
};

type Actions = {
  addNamePage: (namePage: string, namePageRu: string) => void;
};

export const usePages = create<State & Actions>((set) => ({
  namePage: 'Categories',
  namePageRu: 'Категории',

  addNamePage: (namePage: string, namePageRu: string) => {
    try {
      set({ namePage, namePageRu });
    } catch (error) {
      console.error(error);
    }
  },
}));
