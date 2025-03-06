import { create } from 'zustand';
import { IBaseOrder, IOrder } from '../models/IOrder';
import axios from "axios";
import { URL } from '../http/url';
import api from '../http/api';

type State = {
  orders: IOrder[],
  order: IOrder | null
  message: string,
  error: string
  isDownloaded: boolean,
  isError: boolean
}

type Actions = {
  clearNotifications: () => Promise<void>;
  addOrder: (orders: IBaseOrder[] | IBaseOrder) => Promise<void>;
  updateOrder: (order: IOrder ) => Promise<void>;
}

const { 
  //urlOnrenderOrders,
  urlJWTOrders,
  //urlLocalserverOrders
 } = URL;

export const useOrders = create<State & Actions>((set)=> ({
  orders: [],
  order: null,
  message: '',
  error: '',
  isDownloaded: false,
  isError: false,

  addOrder: async (order: IBaseOrder[] | IBaseOrder) => {
    try {
      set({ isDownloaded: true, isError: false });
      const responseAdd = await api.post(
        //urlOnrenderOrders,
        urlJWTOrders,
        //urlLocalserverOrders,
        //"https://marusina-sweets.onrender.com/categories/",
        //"http://127.0.0.1:8000/categories/",
        order
      );

      console.log(order)
      if (responseAdd.status === 201) {
        set({ message: responseAdd.data.message, isDownloaded: false })
      };
      //await fetchOrders(set);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          console.error(error.response.data.detail);
          set({
            error: error.response.data.detail,
            isDownloaded: false,
            isError: false,
          });
        } else {
          console.error("Непредвиденная ошибка: ", error.response?.data);
          set({
            error: error.response?.data.detail || "Непредвиденная ошибка",
            isDownloaded: false,
            isError: false,
          });
        }
      } else {
        console.error("Непредвиденная ошибка:", error);
        set({
          error: "Непредвиденная ошибка",
          isDownloaded: false,
          isError: true,
        });
      }
    }
  },

  updateOrder: async (order: IOrder) => {
    try {
      set({ isDownloaded: false, isError: false });
      const { id } = order;
      const responseUpdate = await api.put(
        //urlOnrenderOrders + id,
        urlJWTOrders + id,
        //`https://marusina-sweets.onrender.com/categories/${id}`,
        //`http://127.0.0.1:8000/categories/${id}`,
        order
      );
      if (responseUpdate.status === 200) {
        set({ message: responseUpdate.data.message })
      };
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

  clearNotifications: async () => set({ message: '', error: '' }),
}))
