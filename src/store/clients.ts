import { create } from 'zustand';
import { IBaseClient, IClient } from '../models/IClient';
import axios from "axios";
import { URL } from '../http/url';
import api from '../http/api';

type State = {
  clients: IClient[],
  client: IClient | null
  message: string,
  error: string
  isDownloaded: boolean,
  isError: boolean,
  existingClient: IClient | null
}

type Actions = {
  clearNotifications: () => Promise<void>;
  addClient: (client: IBaseClient ) => Promise<void>;
  updateClient: (client: IClient ) => Promise<void>;
  removeClient: (id: number) => Promise<void>;
}

const { 
  //urlOnrenderClients,
  urlJWTClients,
  //urlLocalserverClients 
} = URL;

export const useClients = create<State & Actions>((set)=> ({
  clients: [],
  client: null,
  message: '',
  error: '',
  isDownloaded: false,
  isError: false,
  existingClient: null,

  addClient: async (client: IBaseClient) => {
    try {
      set({ isDownloaded: true, isError: false });
      const responseAdd = await api.post(
        //urlOnrenderClients,
        urlJWTClients,
       //"http://127.0.0.1:8000/orders",
        //urlLocalserverClients,
        //"https://marusina-sweets.onrender.com/categories/",
        client
      );
      if (responseAdd.status === 201) {
        set({ 
          message: responseAdd.data.message,
          client: responseAdd.data.client,
          isDownloaded: false
        })
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          console.error(error.response.data.detail.error);
          set({
            error: error.response.data.detail.error,
            existingClient: error.response.data.detail.client,
            isDownloaded: false,
            isError: false,
          });
        } else {
          console.error("Непредвиденная ошибка: ", error.response?.data);
          set({
            error: error.response?.data || "Непредвиденная ошибка",
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

  updateClient: async (client: IClient) => {
    try {
      set({ isDownloaded: true, isError: false });
      const { id } = client;
      const responseUpdate = await api.put(
        //urlLocalserverClients +id,
        //urlOnrenderClients + id,
        urlJWTClients + id,
        //`https://marusina-sweets.onrender.com/categories/${id}`,
        //`http://127.0.0.1:8000/categories/${id}`,
        client
      );
      if (responseUpdate.status === 200) {
        set({ 
          message: responseUpdate.data.message,
          isDownloaded: false
        })
      };
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
            error: error.response?.data || "Непредвиденная ошибка",
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

  removeClient: async (id: number) => {
    try {
      set({ isDownloaded: false, isError: false });
      const responseDel = await api.delete(
        //urlOnrenderClients + id,
        urlJWTClients + id,
        //`https://marusina-sweets.onrender.com/categories/${id}`,
        //`http://127.0.0.1:8000/categories/${id}`,
      );
      if (responseDel.status === 200) {
        set({ message: responseDel.data.message })
      } else {
        set({ error: responseDel.data.message })
      };
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
