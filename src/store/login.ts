import { create } from 'zustand';
import { IBaseLogin } from '../models/ILogin';
import axios from "axios";
import { URL } from '../http/url';

type State = {
  user: IBaseLogin | null
  message: string,
  error: string
  isDownloaded: boolean,
  isError: boolean,
  access: boolean,
  isValid: boolean
}

type Actions = {
  login: (user: IBaseLogin ) => Promise<void>;
  validation: (token: string | null) => Promise<void>;
  clearNotifications: () => Promise<void>;
}

const { 
  //urlOnrenderLogin, 
  urlLocalserverLogin,
  urlLocalserverValidate
} = URL;

export const useLogin = create<State & Actions>((set)=> ({
    user: null,
    message: '',
    error: '',
    isDownloaded: false,
    isError: false,
    access: false,
    isValid: false,

    login: async (user: IBaseLogin) => {
      try {
        set({ isDownloaded: false, isError: false });
        const response = await axios.post(
          urlLocalserverLogin,
          //"https://marusina-sweets.onrender.com/categories/",
          //"http://127.0.0.1:3001/login",
          user
        );
        if (response.status === 200) {
          set({ 
            message: response.data.message, 
            user: user,
            access: true
          });
          localStorage.setItem("access-token", response.data.access_token);
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            console.error(error.response.data.detail);
            set({
              error: error.response.data.detail,
              isDownloaded: false,
              isError: false,
              access: false,
            });
            localStorage.removeItem("access-token");
          } else {
            console.error("Непредвиденная ошибка: ", error.response?.data);
            set({
              error: error.response?.data || "Непредвиденная ошибка",
              isDownloaded: true,
              isError: true,
              access: false,
            });
          }
        } else {
          console.error("Непредвиденная ошибка:", error);
          set({
            error: "Непредвиденная ошибка",
            isDownloaded: true,
            isError: true,
            access: false,
          });
        }
      }
    },

    validation: async (token: string | null) => {
      try {
        const response = await axios.get(
          //"http://127.0.0.1:8000/auth/validate",
          urlLocalserverValidate, 
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
        );
        if (response.status === 200) {
          set({ 
            user: response.data.user,
            isValid: response.data.valid,
            access: true,
          });
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            console.error(error.response.data.detail);
            set({
              error: error.response.data.detail,
              isDownloaded: false,
              isError: false,
              access: false,
              isValid: false,
            });
          } else {
            console.error("Непредвиденная ошибка: ", error.response?.data);
            set({
              error: error.response?.data || "Непредвиденная ошибка",
              isDownloaded: true,
              isError: true,
              access: false,
              isValid: false,
            });
          }
        } else {
          console.error("Непредвиденная ошибка:", error);
          set({
            error: "Непредвиденная ошибка",
            isDownloaded: true,
            isError: true,
            access: false,
            isValid: false,
          });
        }
      }
    },

    clearNotifications: async () => set({ message: '', error: '' }),
}))
