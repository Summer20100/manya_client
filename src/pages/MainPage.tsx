import { FC, useState, useEffect } from "react";
import Page from "./components/Header/Header";
import { usePages } from "../../src/store/pages";
import { usePopup } from "../../src/store/popup";
import Categories from "./components/Categories/Categories";
import Products from "./components/Products/Products";
import Clients from "./components/Clients/Clients";
import Popup from "./components/Popup/Popup";
import Orders from "./components/Orders/Orders";

const MainPage: FC = () => {
  const { namePage, namePageRu } = usePages();
  const { isOpen, isOpenHandler, addNamePopup } = usePopup();

  const [namePopup, setNamePopup] = useState<string>('');
  const [namePopupRu, setNamePopupRu] = useState<string>('');

  useEffect(() => {
    if (namePage === "Products") {
      setNamePopup("AddProduct");
      setNamePopupRu("Добавить продукт")
    } else if(namePage === "Categories") {
      setNamePopup("AddCategory");
      setNamePopupRu("Добавить категорию")
    } else if (namePage === "Orders") {
      setNamePopup("AddOrder");
      setNamePopupRu("Добавить заказ")
    } else if (namePage === "Clients") {
      setNamePopup("AddClient");
      setNamePopupRu("Добавить клиента")
    } else if (namePage === "Photos") {
      setNamePopup("AddPhoto");
      setNamePopupRu("Добавить фото")
    }
  }, [namePage]);

  return (
    <>
      <Page />
{/*       <h1>{namePageRu}</h1>
      <button className="add-btn"
        onClick={() => {
          isOpenHandler(true);
          addNamePopup(namePopup, namePopupRu);
        }}
      >
        Добавить в раздел "{namePageRu}"
      </button>
      { isOpen && <Popup /> } */}
      { namePage === "Categories" && <Categories /> }
      { namePage === "Products" && <Products /> }
      { namePage === "Clients" && <Clients /> }
      { namePage === "Orders" && <Orders /> }
    </>
  );
};

export default MainPage;
