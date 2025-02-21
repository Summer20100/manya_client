import { create } from 'zustand';
import { IBaseCategory, ICategory } from '../models/ICategory';
import axios from "axios";
import { URL } from '../http/url';
import api from '../http/api';

type State = {
  categories: ICategory[],
  category: ICategory | null
  message: string,
  error: string
  isDownloaded: boolean,
  isError: boolean,
}

type Actions = {
  getCategories: () => Promise<void>;
  clearNotifications: () => Promise<void>;
  getCategoryById: (id: number) => Promise<void>;
  addCategory: (category: IBaseCategory ) => Promise<void>;
  updateCategory: (category: ICategory ) => Promise<void>;
  removeCategory: (id: number) => Promise<void>;
}

const { 
  //urlOnrenderCategories,
  urlJWTCategories
  //urlLocalserverCategories 
} = URL;

const fetchCategories = async (set: (state: Partial<State>) => void) => {
  try {
/*     const response = await axios.get(
      //urlOnrenderCategories
      //"https://marusina-sweets.onrender.com/categories/"
      `http://127.0.0.1:8000/categories/`
    ); */

    const response = await api.get(
      //urlOnrenderCategories
      //"https://marusina-sweets.onrender.com/categories/"
      //`http://127.0.0.1:8000/categories/`
      urlJWTCategories
    );
    if (response.status === 200) {
      set({ categories: response.data, isDownloaded: true, isError: false });
    } else {
      set({ categories: [], isDownloaded: true, isError: true });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data);
      set({
        error: error.response?.data.detail || "Произошла непредвиденная ошибка",
        isDownloaded: true,
        isError: false,
      });
    } else {
      console.error("Unexpected error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      set({
        error: errorMessage,
        isDownloaded: true,
        isError: false,
      });
    }
  }
};

export const useCategories = create<State & Actions>((set)=> ({
    categories: [],
    category: null,
    message: '',
    error: '',
    isDownloaded: false,
    isError: false,

    getCategories: async () => {
      set({ isDownloaded: false, isError: false });
      await fetchCategories(set);
    },

    getCategoryById: async (id: number) => {
      try {
        set({ isDownloaded: false, isError: false });
        const response = await api.get(
          //urlOnrenderCategories + id,
          urlJWTCategories + id,
          //`https://marusina-sweets.onrender.com/categories/${id}`,
          //`http://127.0.0.1:8000/categories/${id}`,
        );
        if (response.status === 200) {
          set({ category: response.data, isDownloaded: true });
        } else {
          set({ category: null });
        }
        await fetchCategories(set);
      } catch (error) {
        console.error(error);
        set({
          error: "An unexpected error occurred",
          isDownloaded: true,
          isError: true,
        });
      }
    },

    addCategory: async (category: IBaseCategory) => {
      try {
        set({ isDownloaded: false, isError: false });
        const responseAdd = await api.post(
          //urlOnrenderCategories,
          urlJWTCategories,
          //"https://marusina-sweets.onrender.com/categories/",
          //"http://127.0.0.1:8000/categories/",
          category
        );
        if (responseAdd.status === 201) {
          set({ message: responseAdd.data.message })
        };
        await fetchCategories(set);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            console.error(error.response.data.detail);
            set({
              error: error.response.data.detail,
              isDownloaded: true,
              isError: false,
            });
          } else {
            console.error("Непредвиденная ошибка: ", error.response?.data);
            set({
              error: error.response?.data || "Непредвиденная ошибка",
              isDownloaded: true,
              isError: true,
            });
          }
        } else {
          console.error("Непредвиденная ошибка:", error);
          set({
            error: "Непредвиденная ошибка",
            isDownloaded: true,
            isError: true,
          });
        }
      }
    },

    updateCategory: async (category: ICategory) => {
      try {
        set({ isDownloaded: false, isError: false });
        const { id } = category;
        const responseUpdate = await api.put(
          //urlOnrenderCategories + id,
          urlJWTCategories +id,
          //`https://marusina-sweets.onrender.com/categories/${id}`,
          //`http://127.0.0.1:8000/categories/${id}`,
          category
        );
        if (responseUpdate.status === 200) {
          set({ message: responseUpdate.data.message })
        };
        await fetchCategories(set);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            console.error(error.response.data.detail);
            set({
              error: error.response.data.detail,
              isDownloaded: true,
              isError: false,
            });
          } else {
            console.error("Непредвиденная ошибка: ", error.response?.data);
            set({
              error: error.response?.data || "Непредвиденная ошибка",
              isDownloaded: true,
              isError: true,
            });
          }
        } else {
          console.error("Непредвиденная ошибка:", error);
          set({
            error: "Непредвиденная ошибка",
            isDownloaded: true,
            isError: true,
          });
        }
      }
    },

    removeCategory: async (id: number) => {
      try {
        set({ isDownloaded: false, isError: false });
        const responseDel = await api.delete(
          //urlOnrenderCategories + id,
          urlJWTCategories +id,
          //urlLocalserverCategories + id,
          //`https://marusina-sweets.onrender.com/categories/${id}`,
          //`http://127.0.0.1:8000/categories/${id}`,
        );
        if (responseDel.status === 200) {
          console.log(responseDel.data.message)
          set({ message: responseDel.data.message })
        } else {
          console.log(responseDel.data.message);
          set({ error: responseDel.data.message })
        };
        await fetchCategories(set);
      } catch (error) {
        console.error(error);
        set({
          error: "An unexpected error occurred",
          isDownloaded: true,
          isError: false,
        });
      }
    },

    clearNotifications: async () => set({ message: '', error: '' }),
}))
