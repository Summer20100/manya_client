import { create } from 'zustand';
import { IBaseProduct, IProduct } from '../models/IProduct';
import axios from "axios";
import { URL } from '../http/url';
import api from '../http/api';

type State = {
  products: IProduct[],
  product: IProduct | null
  message: string,
  error: string
  isDownloaded: boolean,
  isError: boolean
}

type Actions = {
  getProducts: () => Promise<void>;
  clearNotifications: () => Promise<void>;
  getProductById: (id: number) => Promise<void>;
  addProduct: (category: IBaseProduct ) => Promise<void>;
  updateProduct: (category: IProduct ) => Promise<void>;
  removeProduct: (id: number) => Promise<void>;
}

const { 
  //urlOnrenderProducts,
  urlJWTProducts
 } = URL;

const fetchProducts = async (set: (state: Partial<State>) => void) => {
  try {
    const response = await api.get(
      //urlOnrenderProducts
      urlJWTProducts
      //"https://marusina-sweets.onrender.com/products/"
      //`http://127.0.0.1:8000/products/`
    );
    if (response.status === 200) {
      set({ products: response.data, isDownloaded: true, isError: false });
    } else {
      set({ products: [], isDownloaded: true, isError: true });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      set({
        error: error.response?.data.detail || "Произошла непредвиденная ошибка",
        isDownloaded: true,
        isError: false,
      });
    } else {
      set({
        error: "Произошла непредвиденная ошибка",
        isDownloaded: true,
        isError: true,
      });
    }
  }
};

export const useProducts = create<State & Actions>((set)=> ({
    products: [],
    product: null,
    message: '',
    error: '',
    isDownloaded: false,
    isError: false,

    getProducts: async () => {
      set({ isDownloaded: false, isError: false });
      await fetchProducts(set);
    },

    getProductById: async (id: number) => {
      try {
        set({ isDownloaded: false, isError: false });
        const response = await api.get(
          //urlOnrenderProducts + id,
          urlJWTProducts + id,
          //`https://marusina-sweets.onrender.com/products/${id}`,
          //`http://127.0.0.1:8000/products/${id}`,
        );
        if (response.status === 200) {
          set({ product: response.data, isDownloaded: true });
        } else {
          set({ product: null });
        }
        await fetchProducts(set);
      } catch (error) {
        console.error(error);
        set({
          error: "Произошла непредвиденная ошибка",
          isDownloaded: true,
          isError: true,
        });
      }
    },

    addProduct: async (product: IBaseProduct) => {
      try {
        set({ isDownloaded: false, isError: false });
        const responseAdd = await api.post(
          //urlOnrenderProducts,
          urlJWTProducts,
          //"https://marusina-sweets.onrender.com/products/",
          //"http://127.0.0.1:8000/products/",
          product
        );
        if (responseAdd.status === 201) {
          set({ message: responseAdd.data.message })
        };
        await fetchProducts(set);
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

    updateProduct: async (product: IProduct) => {
      try {
        set({ isDownloaded: false, isError: false });
        const { id } = product;
        const responseUpdate = await api.put(
          //urlOnrenderProducts + id,
          urlJWTProducts + id,
          //`https://marusina-sweets.onrender.com/products/${id}`,
          //`http://127.0.0.1:8000/products/${id}`,
          product
        );
        if (responseUpdate.status === 200) {
          set({ message: responseUpdate.data.message })
        };
        await fetchProducts(set);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error.response?.data);
          set({ error: error.response?.data, isDownloaded: true });
        } else {
          console.error("Произошла непредвиденная ошибка:", error);
          set({
            error: "Произошла непредвиденная ошибка",
            isDownloaded: true,
            isError: true,
          });
        }
      }
    },

    removeProduct: async (id: number) => {
      try {
        set({ isDownloaded: false, isError: false });
        const responseDel = await api.delete(
          //urlOnrenderProducts + id,
          urlJWTProducts + id,
          //`https://marusina-sweets.onrender.com/products/${id}`,
          //`http://127.0.0.1:8000/products/${id}`,
        );
        if (responseDel.status === 200) {
          set({ message: responseDel.data.message })
        } else {
          set({ error: responseDel.data.message })
        };
        await fetchProducts(set);
      } catch (error) {
        console.error(error);
        set({
          error: "Произошла непредвиденная ошибка",
          isDownloaded: true,
          isError: true,
        });
      }
    },

    clearNotifications: async () => set({ message: '', error: '' }),
}))
