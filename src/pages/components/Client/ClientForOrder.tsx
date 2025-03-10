import { FC, useEffect, useState } from "react";
import InputMask from "react-input-mask-next";
import { IClientLocalStorage, IBaseClient } from "../../../models/IClient";
import { useClients } from "../../../store/clients";
import { useLocalStorageWatcher, removeOrdersFromLocalStorage } from "../../../store/localStorage";
import { useOrders } from "../../../store/orders";

export interface IOrderInfo {
    comments?: string | null;
    date: string | null;
}

const ClientForOrder: FC = () => {
    const { 
        addClient,
        client,
        existingClient,
        updateClient,
    } = useClients();

    const storageData  =  useLocalStorageWatcher();
    const { 
        ordersFromBasket,
    } = storageData;

    const { 
        addOrder,
        message
     } = useOrders();

    const [adres, setAdres] = useState<string | null>(null);
    const [ordersInfo, setOrdersInfo] = useState<IOrderInfo | null>(null);
    const [formData, setFormData] = useState<IClientLocalStorage | null>(null);
    const [formRegistration, setFormRegistration] = useState<IBaseClient>({
        name: '',
        phone: ''
    });

    useEffect(() => {
        const info = JSON.parse(sessionStorage.getItem('ordersInfo') || "null")
        if (info) {
            const { date } = info;
            const currentDate = new Date().toISOString().split("T")[0];
            if ( date < currentDate || !date) {
                setOrdersInfo({ ...info, date: currentDate })
                sessionStorage.setItem('ordersInfo', JSON.stringify({ ...info, date: currentDate }))
            } else {
                setOrdersInfo(info)
            }
        }
    }, [])

    useEffect(() => {
        sessionStorage.setItem('ordersInfo', JSON.stringify(ordersInfo))
    }, [ordersInfo])

    useEffect(() => {
        const clientFromLocal = JSON.parse(localStorage.getItem('client') || 'null');
        if (clientFromLocal) {
            setFormData(clientFromLocal);
            setAdres(clientFromLocal.adres);
        };
        const mewOrderInfo = JSON.parse(sessionStorage.getItem('ordersInfo') || 'null');
        if ( mewOrderInfo === null) {
            const mewOrderInfo = {
                comments: '',
                date: new Date().toISOString().split("T")[0]
            };
            sessionStorage.setItem('ordersInfo', JSON.stringify(mewOrderInfo))
        }
    }, []);

    useEffect(() => {   
        if ( message.length !== 0 ) {
            const mewOrderInfo = {
                comments: '',
                date: new Date().toISOString().split("T")[0]
            };
            sessionStorage.setItem('ordersInfo', JSON.stringify(mewOrderInfo))
            sessionStorage.removeItem('ordersInfo');
            removeOrdersFromLocalStorage("order_");
            setOrdersInfo(mewOrderInfo);
        }
    }, [message]);
    


    useEffect(() => {
        if (client) {
            const clientToLocalStorage = { ...client, adres: adres };
            localStorage.setItem('client', JSON.stringify(clientToLocalStorage));
            setFormData(clientToLocalStorage);
        } else if (existingClient) {
            const clientToLocalStorage = { ...formRegistration, id: existingClient.id, adres: adres };
            localStorage.setItem('client', JSON.stringify(clientToLocalStorage));
            setFormData(clientToLocalStorage);
            updateClient({
                ...formRegistration,
                id: existingClient.id
            });
        }
    }, [client, existingClient, formRegistration, updateClient]);

    const [errors, setErrors] = useState<Record<string, { message: string }>>({});

    const handleChangeRegistration = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'adres') {
            setAdres(value);
        }
          
        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };

            const mewOrderInfo = JSON.parse(sessionStorage.getItem('ordersInfo') || 'null');

    
            if (name === "phone") {
                if (value.replace(/\D/g, "").length < 11) {
                    newErrors[name] = { message: "Длина номера не меньше 10 цифр" };
                } else if (value.replace(/\D/g, "").length > 16) {
                    newErrors[name] = { message: "Длина номера не более 16 цифр" };
                } else {
                    delete newErrors[name];
                }
            };
            if (name === "name") {
                if (value.length < 3) {
                    newErrors[name] = { message: "Имя не менее 3 символов" };
                } else if (value.length > 24) {
                    newErrors[name] = { message: "Имя не более 25 символов" };
                } else {
                    delete newErrors[name];
                }
            };
            if (name === "adres") {
                if (value.length > 99) {
                    newErrors[name] = { message: "Адрес не более 100 символов" };
                } else {
                    delete newErrors[name];
                }
            };
            if (name === "comments") {
                setOrdersInfo(prev => ({ ...prev, comments: value, date: mewOrderInfo.date}));
                if (value.length > 99) {
                    newErrors[name] = { message: "Комментарии не более 100 символов" };
                } else {
                    delete newErrors[name];
                }
            };
            if (name === "date") {
                setOrdersInfo(prev => ({ ...prev, date: value }));
                const currentDay = new Date().toISOString().split("T")[0]
                if (value < currentDay) {
                    newErrors[name] = { message: "Дата доставки не ранее, чем сегодня" };
                } else {
                    delete newErrors[name];
                }
            };
            return newErrors;
        });

        setFormRegistration(prevData => ({
            ...prevData,
            [name]: name === "phone" ? `+7${value.replace(/\D/g, "").slice(1)}` : value
        }));
    };
    
    const onRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.keys(errors).length === 0) {
            await addClient(formRegistration);
            toCreateOrder();
            window.location.reload();
        }
    };

    console.log(adres)

    const toCreateOrder = async () => {
        const clientInfo = JSON.parse(localStorage.getItem('client') || "{}");
    
        const { adres: adresForOrder, name: client_name, phone: client_phone, id } = clientInfo;
        const { comments: comment, date } = ordersInfo || {};
    
        const currentDate = new Date().toISOString().split("T")[0];
    
        const orders = ordersFromBasket.map(el => ({
            client_phone,
            client_name,
            product_id: el.product_id,
            quantity: el.quantity,
            total_price: el.total_price,
            total_weight: el.total_weight,
            adres: (adres && adres.length > 0) ? adres : adresForOrder,
            comment: comment ?? null,
            is_active: false,
            date: date ?? currentDate,
        }));

        try {
            await addOrder(orders);
            const newClient = {
                id,
                name: client_name, 
                phone: client_phone,
                adres: (adres && adres.length > 0) ? adres : adresForOrder,
            };
            localStorage.setItem('client', JSON.stringify(newClient));
        } catch (e) {
            console.log(e);
        };
        //window.location.reload();
    };
    
    return (
        <div style={{position: "relative"}}>
            {formData ? (
                <>
                    <div><span style={{ fontWeight: "bolder" }}>Имя: </span>{formData.name}</div>
                    <div><span style={{ fontWeight: "bolder" }}>Номер телефона: </span>{formData.phone}</div>
                    { formData.adres
                        ?
                        <div><span style={{ fontWeight: "bolder" }}>Адрес доставки: </span>{formData.adres}</div>
                        :
                        <label>
                            <div style={{ fontWeight: "bolder", marginTop: '15px' }}>Адрес доставки: </div>
                            <div style={{ position: 'relative', display: 'flex' }}>
                                <textarea
                                    className="input" 
                                    name="adres" 
                                    id="adres"
                                    onChange={handleChangeRegistration}
                                />
                            </div>
                        </label>
                    }
                    

                    <label>
                        <div style={{ fontWeight: "bolder", marginTop: '15px' }}>Комментарий (если нужен): </div>
                        <div style={{ position: 'relative', display: 'flex' }}>
                            <textarea
                                placeholder="Уточнение для заказа"
                                className="input" 
                                name="comments"
                                id="comments"
                                maxLength={100}
                                onChange={handleChangeRegistration}
                                value={ordersInfo?.comments ?? ""}
                            />
                            {errors.comments && <div className="errors">{errors.comments.message}</div>}
                        </div>
                    </label>

                    <label>
                        <div style={{ fontWeight: "bolder", marginTop: '15px' }}>Дата доставки: </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="input"
                                name="date"
                                type="date"
                                placeholder="Дата доставки"
                                onChange={handleChangeRegistration}
                                value={ ordersInfo?.date ?? new Date().toISOString().split("T")[0]}
                            />
                            {errors.date && <div className="errors">{errors.date.message}</div>}
                        </div>
                    </label>

                    { ordersFromBasket.length > 0 &&
                        <button 
                            className="button" 
                            type="submit" 
                            style={{ width: '100%', textTransform: 'uppercase', marginTop: '15px' }}
                            onClick={toCreateOrder}
                        >
                            заказать
                        </button>
                    }
                    
                </>
            ) : (
                <>
                    <form onSubmit={onRegistration}>
                        <label>
                            <div style={{ fontWeight: "bolder", marginTop: '15px' }}>Имя: </div>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    id="name" 
                                    className="input" 
                                    type="text" 
                                    name="name" 
                                    value={formRegistration.name} 
                                    onChange={handleChangeRegistration}
                                    required
                                />
                                {errors.name && <div className="errors">{errors.name.message}</div>}
                            </div>
                        </label>

                        <label>
                            <div style={{ fontWeight: "bolder", marginTop: '15px' }}>Номер телефона:</div>
                            <div style={{ position: 'relative' }}>
                                <InputMask
                                    className="input" 
                                    name="phone" 
                                    id="phone" 
                                    type="tel" 
                                    mask="+7(999)999-99-99"
                                    placeholder="+7(XXX)XXX-XX-XX" 
                                    value={formRegistration.phone} 
                                    onChange={handleChangeRegistration} 
                                    required 
                                    min={10} 
                                    style={{ fontFamily: "monospace" }}
                                />
                                {errors.phone && <div className="errors">{errors.phone.message}</div>}
                            </div>
                        </label>

                        <label>
                            <div style={{ fontWeight: "bolder", marginTop: '15px' }}>Адрес доставки: </div>
                            <div style={{ position: 'relative', display: 'flex' }}>
                                <textarea
                                    className="input" 
                                    placeholder="Адрес доставки"
                                    name="adres" 
                                    id="adres"
                                    maxLength={100}
                                    onChange={handleChangeRegistration}
                                />
                                {errors.adres && <div className="errors">{errors.adres.message}</div>}
                            </div>
                        </label>

                        <label>
                            <div style={{ fontWeight: "bolder", marginTop: '15px' }}>Комментарий (если нужен): </div>
                            <div style={{ position: 'relative', display: 'flex' }}>
                                <textarea
                                    placeholder="Уточнение для заказа"
                                    className="input" 
                                    name="comments"
                                    id="comments"
                                    maxLength={100}
                                    onChange={handleChangeRegistration}
                                />
                                {errors.comments && <div className="errors">{errors.comments.message}</div>}
                            </div>
                        </label>


                        <label>
                            <div style={{ fontWeight: "bolder", marginTop: '15px' }}>Дата доставки: </div>
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="input"
                                    name="date"
                                    type="date"
                                    placeholder="Дата доставки"
                                    defaultValue={new Date().toISOString().split("T")[0]}
                                    onChange={handleChangeRegistration}
                                />
                                {errors.date && <div className="errors">{errors.date.message}</div>}
                            </div>
                        </label>

                        { ordersFromBasket.length > 0 &&
                            <button className="button" type="submit" style={{ width: '100%', textTransform: 'uppercase', marginTop: '15px' }}>
                                заказать
                            </button>
                        }
                    </form>
                </>
            )}
        </div>
    );
}

export default ClientForOrder;
