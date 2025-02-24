import { FC, useState, useEffect } from "react";
import { IProduct } from "../../../models/IProduct";
import { FaShoppingCart } from 'react-icons/fa';
import { IOrderForLocalstorage } from "../../../models/IOrder";


const Product: FC<IProduct> = ({
    id,
    title,
    is_active,
    description,
    img_URL,
    img_title,
    price_for_itm,
    weight_for_itm,
}) => {
   
    const img_URL_no_photo = "/img/no_photo.jpg";

    const [count, setCount] = useState<number>(1)

    const increment = () => setCount(prev => prev + 1);
    const decrement = () => setCount(prev => (prev > 1 ? prev - 1 : 1));

    const [order, setOrder] =useState<IOrderForLocalstorage>({
        client_phone: null,
        client_name: null,
        product_id: 0,
        quantity: 1,
        total_price: 0,
        total_weight: 0,
        adres: null,
        comment: null,
        is_active: false,
        date: new Date().toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    });

    useEffect(() => {
        setOrder(prev => ({
            ...prev,
            product_id: id,
            quantity: count,
            total_price: count * (price_for_itm ?? 0),
            total_weight: count * (weight_for_itm ?? 0),
        }));
    }, [id, price_for_itm, weight_for_itm, count]);

    const toBasket = () => {
        localStorage.setItem(`order_${id}`, JSON.stringify(order))
    }
    

    return (
        <>
            { is_active &&
                    <div className="product-card" key={id}>
                    <div className="img">
                        <img
                            src={img_URL && img_URL.trim() ? img_URL : img_URL_no_photo}
                            alt={img_title || "Изображение категории"}
                            title={img_title || "Изображение категории"}
                        />
                    </div>
                    <div className="title">{title}</div>
                    <div className="description">{description}</div>
        
                    <div className="product-details">
                        <div className="product-info">
                            <div className="price">{price_for_itm} ₽</div>
                            <div className="weight">{weight_for_itm} г.</div>
                        </div>
                        <div className="btns-basket">
                            <div className="btn-add">
                                <div 
                                    className="btn-dec"
                                    onClick={decrement}
                                > - </div>
                                <div>{ count }</div>
                                <div 
                                    className="btn-inc" 
                                    onClick={increment}
                                > + </div>
                            </div>
        
                            <div className="btn-add-to-cart" onClick={toBasket}>
                                <FaShoppingCart /> 
                            </div>
                        </div>
                    </div>
                </div>    
            }        
        </>
    );
}

export default Product;
