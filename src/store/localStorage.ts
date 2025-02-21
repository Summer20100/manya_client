import { useEffect, useState } from "react";
import { IOrderWithoutClient } from "../models/IOrder";

export const useLocalStorageWatcher = () => {
    const getStorageData = () => {
        const ordersArray: (IOrderWithoutClient & { title_local: string })[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith("order_")) {
                try {
                    const order = JSON.parse(localStorage.getItem(key) as string);
                    ordersArray.push({ ...order, title_local: key });
                } catch {
                    console.error(`Ошибка парсинга JSON для ключа: ${key}`);
                }
            }
        }
        return ordersArray;
    };

    const getSessionData = () => {
        try {
            return JSON.parse(sessionStorage.getItem("ordersInfo") || "null");
        } catch {
            console.error("Ошибка парсинга JSON в sessionStorage[ordersinfo]");
            return null;
        }
    };

    const [storageData, setStorageData] = useState(getStorageData);
    const [sessionData, setSessionData] = useState(getSessionData);

    useEffect(() => {
        const updateStorage = () => {
            setStorageData(getStorageData());
            setSessionData(getSessionData());
        };

        // Проверяем изменения в localStorage и sessionStorage через setInterval
        const interval = setInterval(() => {
            const newData = getStorageData();
            const newSessionData = getSessionData();

            if (JSON.stringify(newData) !== JSON.stringify(storageData) || 
                JSON.stringify(newSessionData) !== JSON.stringify(sessionData)) {
                setStorageData(newData);
                setSessionData(newSessionData);
            }
        }, 500); // Проверяем 2 раза в секунду

        // Отслеживание изменений в другой вкладке
        window.addEventListener("storage", updateStorage);

        return () => {
            clearInterval(interval);
            window.removeEventListener("storage", updateStorage);
        };
    }, [storageData, sessionData]); // Следим за обоими состояниями

    const total_price = storageData.reduce((acc, el) => acc + el.total_price, 0);
    const total_weight = storageData.reduce((acc, el) => acc + el.total_weight, 0);
    const total_quantity = storageData.reduce((acc, el) => acc + el.quantity, 0);

    return { 
        ordersFromBasket: storageData, 
        sessionOrdersInfo: sessionData, 
        total_price, 
        total_weight, 
        total_quantity 
    };
};



export const removeOrdersFromLocalStorage = (el: string) => {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(el)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
};
