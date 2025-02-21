import { FC } from "react";
import Order from "./Order";
import { useLocalStorageWatcher } from "../../../store/localStorage";
import ClientForOrder from "../Client/ClientForOrder";

const Orders: FC = () => {
    const storageData  =  useLocalStorageWatcher();
    const { ordersFromBasket, total_price, total_weight, total_quantity } = storageData;

    const currentClient = JSON.parse(localStorage.getItem('client') || 'null')
 
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


            <div>
                <div>
                    <span style={{ fontWeight: "bolder" }}>Имя: </span>
                    {currentClient?.name}
                </div>
                <div>
                    <span style={{ fontWeight: "bolder" }}>Номер телефона: </span>
                    {currentClient?.phone}
                </div>
                <div>
                    <span style={{ fontWeight: "bolder" }}>Адрес доставки: </span>
                    {currentClient?.adres}
                </div>
                <div>
                    <span style={{ fontWeight: "bolder" }}>Комментарий (если нужен): </span>
                    <textarea
                        placeholder="Уточнение для заказа"
                        className="input" 
                        name="adres"
                        id="comments"
                     />
                </div>
                <div style={{ position: 'relative' }}>
                    <label>
                        <div style={{ fontWeight: "bolder" }}>Дата доставки: </div>
                        <input
                            className="input"
                            name="date"
                            //{...register('date')}
                            type="date"
                            placeholder="Дата доставки"
                            defaultValue={new Date().toISOString().split("T")[0]}
                        />
                        {/* {errors.date && <div className="errors">{errors.date.message}</div>} */}
                    </label>
                </div>
            </div>

        </>
        
    );
};

export default Orders;
