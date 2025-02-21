import { FC, useEffect, useState } from "react";
import { IOrderWithoutClient } from "../../../models/IOrder";
import { useProducts } from "../../../store/products";
import { IProduct } from "../../../models/IProduct";
import { MdDeleteForever } from "react-icons/md";

const Order: FC<IOrderWithoutClient> = ({
    title_local,
    product_id,
    quantity,
    total_price,
    total_weight,
}) => {
   
    const { products } = useProducts();
    const [product, setProduct] = useState<IProduct | undefined>();
    const img_URL_no_photo = "/img/no_photo.jpg";

    useEffect(() => {
        const product = products.find(p => product_id === p.id);
        setProduct(product);
    }, [product_id, products]); 

    const [count, setCount] = useState<number>(() => {
        return quantity ?? 1;
    });

    const increment = () => setCount(prev => prev + 1);
    const decrement = () => setCount(prev => (prev > 1 ? prev - 1 : 1));

    const delItmFromLocalStorage = () => {
        localStorage.removeItem(title_local)
    };

    const [priceForNew, setPriceForNew ] = useState<number>(0);
    const [weightForNew, setWeightForNew ] = useState<number>(0)

    useEffect(() => {
        setPriceForNew((total_price / quantity) * count);
        setWeightForNew((total_weight / quantity) * count);
    }, [count, quantity, total_price, total_weight])

    useEffect(() => {
        const currentOrder = JSON.parse(localStorage.getItem(`${title_local}`) || 'null')

        const newOrder = {
            ...currentOrder,
            quantity: count,
            total_price: priceForNew,
            total_weight: weightForNew
        }

        localStorage.setItem(`${title_local}`, JSON.stringify(newOrder))

    }, [priceForNew, weightForNew])


    return (
        <div className="order-card" key={title_local}>
            <div className="order-img">
                <img
                    src={product?.img_URL && product?.img_URL.trim() ? product?.img_URL : img_URL_no_photo}
                    alt={product?.img_title || "Изображение категории"}
                    title={product?.img_title || "Изображение категории"}
                />
            </div>
            <div className="order-details">
                <div style={{ fontWeight: 'bolder', fontSize: '16px' }}>{ product?.title }</div>
                <div className="order-details_correct">
                    <div 
                        style={{ color: 'red', fontWeight: 'bolder' }}
                    >{ priceForNew } ₽</div>


                    <div className="order-btns-basket">
                        <div className="order-btn_add">
                            <div 
                                className="btn-dec"
                                onClick={decrement}
                            > - </div>
                            <div style={{ width: '30px' }}>{ count }</div>
                            <div 
                                className="btn-inc" 
                                onClick={increment}
                            > + </div>
                        </div>

                        <div className="order-btn_del-from-localstorage" onClick={delItmFromLocalStorage}>
                            <MdDeleteForever />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Order;