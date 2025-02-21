import { FC } from "react";
import Order from "./Order";
import { useLocalStorageWatcher } from "../../../store/localStorage";
import ClientForOrder from "../Client/ClientForOrder";

const Orders: FC = () => {
    const storageData  =  useLocalStorageWatcher();
    const { ordersFromBasket, total_price, total_weight, total_quantity } = storageData;

    return (
        <>
            <div className="orders">
                { ordersFromBasket.length > 0
                    ?
                    <>
                        <div className="orders-title">Ваши заказы</div>
                        {ordersFromBasket.map((order) => (
                            <Order key={order.title_local} {...order} />
                        ))}
                    </>
                    
                    :
                    <h3 style={{ marginLeft: '15px' }}>Заказов пока нет</h3>
                }
            </div>

            <div style={{ border: '1px solid black'}} ></div>
            <div className="total-info">
                <div>
                    <strong>Цена:</strong>
                    <strong style={{ color: 'red' }}>{total_price} ₽</strong>
                </div>
                <div>
                    <strong>Вес:</strong>
                    <strong style={{ color: 'red' }}>{total_weight} г.</strong>
                </div>
                <div>
                    <strong>Кол-во:</strong>
                    <strong style={{ color: 'red' }}>{total_quantity} шт.</strong>
                </div>
            </div>

            < ClientForOrder />

        </>
        
    );
};

export default Orders;
