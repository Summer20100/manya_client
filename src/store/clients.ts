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
  getClients: () => Promise<void>;
  clearNotifications: () => Promise<void>;
  getClientById: (id: number) => Promise<void>;
  addClient: (client: IBaseClient ) => Promise<void>;
  updateClient: (client: IClient ) => Promise<void>;
  removeClient: (id: number) => Promise<void>;
}

const { 
  //urlOnrenderClients,
  urlJWTClients,
  //urlLocalserverClients 
} = URL;

const fetchClients = async (set: (state: Partial<State>) => void) => {
  try {
    const response = await api.get(
      //urlOnrenderClients
      //"https://marusina-sweets.onrender.com/categories/"
      //`http://127.0.0.1:8000/categories/`
      urlJWTClients
    );
    if (response.status === 200) {
      set({ clients: response.data, isDownloaded: true, isError: false });
    } else {
      set({ clients: [], isDownloaded: true, isError: true });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data.detail || "Произошла непредвиденная ошибка");
      set({
        //error: error.response?.data.detail || "Произошла непредвиденная ошибка",
        isDownloaded: true,
        isError: false,
      });
    } else {
      console.log( "Произошла непредвиденная ошибка");
      set({
        //error: "Произошла непредвиденная ошибка",
        isDownloaded: true,
        isError: true,
      });
    }
  }
};

export const useClients = create<State & Actions>((set)=> ({
  clients: [],
  client: null,
  message: '',
  error: '',
  isDownloaded: false,
  isError: false,
  existingClient: null,

  getClients: async () => {
    set({ isDownloaded: false, isError: false });
    await fetchClients(set);
  },

  getClientById: async (id: number) => {
    try {
      set({ isDownloaded: false, isError: false });
      const response = await api.get(
        //urlOnrenderClients + id,
        urlJWTClients +id,
        //`https://marusina-sweets.onrender.com/categories/${id}`,
        //`http://127.0.0.1:8000/categories/${id}`,
      );
      if (response.status === 200) {
        set({ client: response.data, isDownloaded: true });
      } else {
        set({ client: null });
      }
      await fetchClients(set);
    } catch (error) {
      console.error(error);
      set({
        error: "Произошла непредвиденная ошибка",
        isDownloaded: true,
        isError: true,
      });
    }
  },

  addClient: async (client: IBaseClient) => {
    try {
      set({ isDownloaded: false, isError: false });
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
          //message: responseAdd.data.message,
          client: responseAdd.data.client
        })
      };
      await fetchClients(set);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          console.error(error.response.data.detail.error);
          set({
            error: error.response.data.detail.error,
            existingClient: error.response.data.detail.client,
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

  updateClient: async (client: IClient) => {
    try {
      set({ isDownloaded: false, isError: false });
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
        set({ message: responseUpdate.data.message })
      };
      await fetchClients(set);
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
      await fetchClients(set);
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
