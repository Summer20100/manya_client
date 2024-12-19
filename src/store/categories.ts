import { create } from 'zustand';
import { ICategory } from '../models/ICategory';
import axios from "axios";

type State = {
  categories: ICategory[]
}

type Actions = {
    getCategories: () => Promise<void>;
}

export const useCategoties = create<State & Actions>((set)=> ({
    categories: [],

    getCategories: async () => {
        try {
          const response = await axios.get(
            "https://marusina-sweets.onrender.com/categories/",
            // "http://127.0.0.1:8000/categories/",
          );
          if (response.status === 200) {
            console.log(response.data)
            set({ categories: response.data });
          } else {
            set({ categories: [] });
          }
        } catch (error) {
          console.error(error);
        }
      },
}))
