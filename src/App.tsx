import "./CSS/style.css";
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { useCategories } from "./store/categories";
import { useProducts } from "./store/products";
import { useClients } from "./store/clients";
import { useLogin } from "./store/login";
import { usePopup } from "./store/popup";
import { usePages } from "./store/pages";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import ErrorPage from "./pages/ErrorPage";
import Loader from "./pages/components/Loader/Loader";
import { ErrorNotification, MessageNotification } from "./pages/components/Notification"
//import { useAuth } from "./http/useAuth";

import Header from "./pages/components/Header/Header";
import Footer from "./pages/components/Footer/Footer";
import Categories from "./pages/components/Categories/Categories";
import Products from "./pages/components/Products/Products";
import Orders from "./pages/components/Orders/Orders";
import Client from "./pages/components/Client/Client";

import './App.css'
import { useOrders } from "./store/orders";


function App() {
  const navigate = useNavigate();
  const { namePopup } = usePopup();
  const { namePage } = usePages();

  const { 
    isError: isCategoriesError, 
    isDownloaded: isCategoriesDownloaded,
    message: messageCategories, 
    error: errorCategories,
    getCategories
  } = useCategories();

  const { 
    isError: isProductsError,
    isDownloaded: isProductsDownloaded,
    message: messageProducts, 
    error: errorProducts,
    getProducts
  } = useProducts();

  const { 
    isError: isClientsError,
    isDownloaded: isClientsDownloaded,
    message: messageClients,
    error: errorClients,
    getClients
  } = useClients();

  const { 
    isError: isOrdersError,
    isDownloaded: isOrdersDownloaded,
    message: messageOrders,
    error: errorOrders,
    getOrders
  } = useOrders();

/*   const { 
    isError: isLoginError,
    //isDownloaded: isLoginDownloaded,
    //access,
    validation,
    message: messageLogin,
    error: errorLogin,
    isValid
  } = useLogin(); */

  const token = localStorage.getItem("access-token");

  useEffect(() => {

      /* if (namePage === "Categories") { */
        getCategories();
      /* } else if (namePage === "Products") { */
        getProducts();
      /* } else if (namePage === "Clients") { */
        getClients();
      /* } else if (namePage === "Orders") { */
        getOrders();
      /* } */

  }, [getCategories, getProducts, getClients, getOrders, token, namePage, namePopup]);

/*   useEffect(() => {
    validation(token);
  }, [validation, token, namePage, namePopup]); */

/*   useEffect(() => {
    if (!isValid) {
      console.log("token не валидный");
      navigate('/login');
    } else if (isValid) {
      console.log("token валидный");
      navigate('/');
    }
  }, [isValid, navigate]); */

  const closeNotification = () => {
    useCategories.getState().clearNotifications();
    useProducts.getState().clearNotifications();
    useClients.getState().clearNotifications();
    useOrders.getState().clearNotifications();
    useLogin.getState().clearNotifications();
  };

  const isDataLoading = !isCategoriesDownloaded || !isProductsDownloaded || !isClientsDownloaded;

/*   if (isCategoriesError) return <ErrorPage />;
  if (isProductsError) return <ErrorPage />;
  if (isClientsError) return <ErrorPage />;
  if (isOrdersError) return <ErrorPage />;
  if (isLoginError) return <ErrorPage />; */

  return (
    <>
      { isDataLoading && <Loader /> }

      {errorCategories && <ErrorNotification message={errorCategories} onClose={closeNotification} />}
      {errorProducts && <ErrorNotification message={errorProducts} onClose={closeNotification} />}
      {errorClients && <ErrorNotification message={errorClients} onClose={closeNotification} />}
      {errorOrders && <ErrorNotification message={errorOrders} onClose={closeNotification} />}
      {/* {errorLogin && <ErrorNotification message={errorLogin} onClose={closeNotification} />} */}
      
      {messageCategories && <MessageNotification message={messageCategories}  onClose={closeNotification}/>}
      {messageProducts && <MessageNotification message={messageProducts}  onClose={closeNotification}/>}
      {messageClients && <MessageNotification message={messageClients}  onClose={closeNotification}/>}
      {messageOrders && <MessageNotification message={messageOrders}  onClose={closeNotification}/>}
      {/* {messageLogin && <MessageNotification message={messageLogin}  onClose={closeNotification}/>} */}

      <Header />
      <Routes>
{/*         { !isValid && <Route path="/login" element={<Login />} /> } */}
{/*         { isValid && <Route path="/" element={<MainPage />} /> } */}
        <Route path="*" element={<ErrorPage />} />
        <Route path="/" element={<Categories />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/client" element={<Client />} />
      </Routes>
      <Footer />
    </>
  );
};


export default App;
