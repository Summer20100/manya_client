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

    const [storageData, setStorageData] = useState(getStorageData);

    useEffect(() => {
        const updateStorage = () => {
            setStorageData(getStorageData());
        };

        // Проверяем изменения в localStorage через setInterval (аналог reactivity)
        const interval = setInterval(() => {
            const newData = getStorageData();
            if (JSON.stringify(newData) !== JSON.stringify(storageData)) {
                setStorageData(newData);
            }
        }, 500); // Проверяем изменения 2 раза в секунду

        // Отслеживание изменений в другой вкладке
        window.addEventListener("storage", updateStorage);

        return () => {
            clearInterval(interval);
            window.removeEventListener("storage", updateStorage);
        };
    }, [storageData]); // Теперь следим за storageData

    const total_price = storageData.reduce((acc, el) => acc + el.total_price, 0);
    const total_weight = storageData.reduce((acc, el) => acc + el.total_weight, 0);
    const total_quantity = storageData.reduce((acc, el) => acc + el.quantity, 0)

    return { ordersFromBasket: storageData, total_price, total_weight, total_quantity };
};
