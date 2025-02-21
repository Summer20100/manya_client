import { FC, useEffect, useRef } from "react";
import { usePopup } from "../../../store/popup";
import PopupAddCategory from "./categories/PopupAddCategory";
import PopupDeleteCategory from "./categories/PopupDeleteCategory";
import PopupUpdateCategory from "./categories/PopupUpdateCategory";

import PopupAddProduct from "./products/PopupAddProduct";
import PopupDeleteProduct from "./products/PopupDeleteProduct";
import PopupUpdateProduct from "./products/PopupUpdateProduct";

import PopupAddClient from "./clients/PopupAddClient";
import PopupDeleteClient from "./clients/PopupDeleteClient";
import PopupUpdateClient from "./clients/PopupUpdateClient";

import PopupAddOrder from "./orders/PopupAddOrder";
import PopupDeleteOrder from "./orders/PopupDeleteOrder";
import PopupUpdateOrder from "./orders/PopupUpdateOrder";



const Popup: FC = () => {
    const popupRef = useRef<HTMLDivElement | null>(null); 
    const { isOpen, namePopup, namePopupRu, isOpenHandler, addNamePopup } = usePopup();

    const popupAddCategories = isOpen && namePopup === "AddCategory";
    const popupDeleteCategories = isOpen && namePopup === "RemoveCategory";
    const popupUpdateCategory = isOpen && namePopup === "UpdateCategory";

    const popupAddProduct = isOpen && namePopup === "AddProduct";
    const popupDeleteProduct = isOpen && namePopup === "RemoveProduct";
    const popupUpdateProduct = isOpen && namePopup === "UpdateProduct";

    const popupAddClient = isOpen && namePopup === "AddClient";
    const popupDeleteClient = isOpen && namePopup === "RemoveClient";
    const popupUpdateClient = isOpen && namePopup === "UpdateClient";

    const popupAddOrder = isOpen && namePopup === "AddOrder";
    const popupDeleteOrder = isOpen && namePopup === "RemoveOrder";
    const popupUpdateOrder = isOpen && namePopup === "UpdateOrder";


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                isOpenHandler(false);
            }
        };
        if (isOpen) {
          document.addEventListener('mousedown', handleClickOutside);
        };
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpenHandler, isOpen]);

    return (
        <div className='popup'>
            <div className="popup__content" ref={popupRef}>
                <div className="popup__header">
                    <span className="popup__title">{ namePopupRu }</span>
                    <button 
                        className="popup__delete-button"
                        onClick={() => {
                            isOpenHandler(false); 
                            addNamePopup('', '')
                        }}>
                        ✕
                    </button>
                </div>
                <div className="popup__wrapper">
                    <div className="popup__container">
                        { popupAddCategories && <PopupAddCategory /> }
                        { popupDeleteCategories && <PopupDeleteCategory /> }
                        { popupUpdateCategory && <PopupUpdateCategory /> }

                        { popupAddProduct && <PopupAddProduct /> }
                        { popupDeleteProduct && <PopupDeleteProduct /> }
                        { popupUpdateProduct && <PopupUpdateProduct /> }

                        { popupAddClient && <PopupAddClient /> }
                        { popupDeleteClient && <PopupDeleteClient /> }
                        { popupUpdateClient && <PopupUpdateClient /> }

                        { popupAddOrder && <PopupAddOrder /> }
                        { popupDeleteOrder && <PopupDeleteOrder /> }
                        { popupUpdateOrder && <PopupUpdateOrder /> }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Popup;
