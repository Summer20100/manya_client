import { create } from 'zustand';

type State = {
  namePopup: string;
  namePopupRu: string;
  isOpen: boolean;
};

type Actions = {
  addNamePopup: (namePage: string, namePopupRu: string) => void;
  isOpenHandler: (isOpen: boolean) => void;
};

export const usePopup = create<State & Actions>((set) => ({
    namePopup: '',
    namePopupRu: '',
    isOpen: false,

    addNamePopup: (namePopup: string, namePopupRu: string) => {
        try {
            set({ namePopup, namePopupRu });
        } catch (error) {
            console.error(error);
        }
    },

    isOpenHandler: (isOpen: boolean) => {
        try {
            set({ isOpen });
        } catch (error) {
            console.error(error);
        }
    }
}));
