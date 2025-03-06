import { FC, useEffect, useState } from "react";
import InputMask from "react-input-mask-next";
import { IClientLocalStorage, IBaseClient, IClientForUpdate } from "../../../models/IClient";
import { useClients } from "../../../store/clients";

const Client: FC = () => {
    const { 
        addClient,
        client,
        existingClient,
        //removeClient,
        updateClient,
    } = useClients();

    const [adres, setAdres] = useState<string | null>("");
    const [formData, setFormData] = useState<IClientLocalStorage | null>(null);
    const [formDataUpdate, setFormDataUpdate] = useState<IClientForUpdate | null>(null);
    const [formRegistration, setFormRegistration] = useState<IBaseClient>({
        name: '',
        phone: ''
    });
    const [isHidden, setIsHidden] = useState(true);

    useEffect(() => {
        const clientFromLocal = JSON.parse(localStorage.getItem('client') || 'null');
        if (clientFromLocal) {
            setFormData(clientFromLocal);
            setFormDataUpdate(clientFromLocal);
            setAdres(clientFromLocal.adres);
        }

        console.log(clientFromLocal)

    }, []);


    
    useEffect(() => {
        if (client) {
            const clientToLocalStorage = { ...client, adres: adres };
            localStorage.setItem('client', JSON.stringify(clientToLocalStorage));
            setFormData(clientToLocalStorage);
            setFormDataUpdate(clientToLocalStorage);
        } else if (existingClient) {
            const clientToLocalStorage = { ...formRegistration, id: existingClient.id, adres: adres };
            localStorage.setItem('client', JSON.stringify(clientToLocalStorage));
            setFormData(clientToLocalStorage);
            setFormDataUpdate(clientToLocalStorage);
            updateClient({
                ...formRegistration,
                id: existingClient.id
            });
        } else {
            const clientFromLocalStorage = JSON.parse(localStorage.getItem('client') || "null");
            setFormData(clientFromLocalStorage);
            setFormDataUpdate(clientFromLocalStorage);
        }
    }, [client, existingClient, formRegistration, updateClient]);

    const handleChangeRegistration = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormRegistration(prevData => ({
            ...prevData,
            [name]: name === "phone" ? `+7${value.replace(/\D/g, "").slice(1)}` : value
        }));
    };
    
    const onRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        await addClient(formRegistration);
        window.location.reload();
    };

    const deleteClient = async () => {
        const clientFromLocal = JSON.parse(localStorage.getItem('client') || 'null');
        if (clientFromLocal) {
            try {
                localStorage.removeItem('client');

                setFormData(null);
                setFormDataUpdate(null);
                setFormRegistration({ name: '', phone: '' });
                setIsHidden(true);
                //await removeClient(clientFromLocal.id);
            } catch (e) {
                console.error("Ошибка при удалении клиента:", e);
            }
        }
    };

    const [errors, setErrors] = useState<Record<string, { message: string }>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if ( name === "adres" ) {
            setAdres(value)
        }
    
        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
    
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
                console.log(value)
                if (value.length > 99) {
                    newErrors[name] = { message: "Адрес не более 100 символов" };
                } else {
                    setAdres(value)
                    delete newErrors[name];
                }
            };
            return newErrors;
        });
    
        setFormDataUpdate(prevData => prevData ? {
            ...prevData,
            [name]: name === "phone" ? `+7${value.replace(/\D/g, "").slice(1)}` : value
        } : null);
    };

    const onUpdateClient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.keys(errors).length === 0) {
            if (formDataUpdate) {
                await updateClient({ 
                    id: formDataUpdate.id, 
                    name: formDataUpdate.name, 
                    phone: formDataUpdate.phone,
                });
                localStorage.setItem('client', JSON.stringify(formDataUpdate));
                setFormData({ 
                    id: formDataUpdate.id, 
                    name: formDataUpdate.name, 
                    phone: formDataUpdate.phone,
                    adres: formDataUpdate.adres || '',
                });
            };
            setIsHidden(true);
        } else {
            setIsHidden(false);
        }
    };

    return (
        <div>
            {formData ? (
                <>
                    <h3>Ваши данные:</h3>
                    <div><span style={{ fontWeight: "bolder" }}>Имя: </span>{formData.name}</div>
                    <div><span style={{ fontWeight: "bolder" }}>Номер телефона: </span>{formData.phone}</div>
                    <div><span style={{ fontWeight: "bolder" }}>Адрес доставки: </span>{formData.adres}</div>

                    <div className="correct-info-client">

                        <div
                            onClick={() => setIsHidden(prev => !prev) }
                            style={{ textAlign: 'center', fontWeight: "bolder", cursor: 'pointer' }}>
                            Нажмите для обновления
                        </div>

                        <form onSubmit={onUpdateClient} style={{ display: isHidden ? 'none' : 'block' }}>
                            <label>
                                <div style={{ fontWeight: "bolder", marginTop: '15px' }}>
                                    Имя: 
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        id="name" className="input" type="text" name="name" 
                                        value={formDataUpdate?.name || ''} onChange={handleChange} required
                                    />
                                    {errors.name && <div className="errors">{errors.name.message}</div>}
                                </div>
                            </label>

                            <label>
                                <div style={{ fontWeight: "bolder", marginTop: '15px' }}>
                                    Номер телефона:
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <InputMask
                                        className="input" name="phone" id="phone" type="tel" mask="+7(999)999-99-99"
                                        placeholder="+7(XXX)XXX-XX-XX" value={formDataUpdate?.phone || ''} 
                                        onChange={handleChange} required min={10} style={{ fontFamily: "monospace" }}
                                    />
                                    {errors.phone && <div className="errors">{errors.phone.message}</div>}
                                </div>
                            </label>
                            <label>
                                <div style={{ fontWeight: "bolder", marginTop: '15px' }}>
                                    Адрес доставки: 
                                </div>
                                <div style={{ position: 'relative', display: 'flex' }}>
                                    <textarea
                                        className="input" name="adres" id="adres"
                                        value={formDataUpdate?.adres ?? ""} onChange={handleChange}
                                    />
                                    {errors.adres && <div className="errors">{errors.adres.message}</div>}   
                                </div>
                            </label>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', gap: "10px", textTransform: 'uppercase' }}>
                                <button className="button" type="submit" style={{ flex: 1, textTransform: 'uppercase' }}>
                                    Обновить данные
                                </button>
                                <div 
                                    className="delete-button" onClick={deleteClient}
                                    style={{ flex: 1, textTransform: 'uppercase', cursor: 'pointer' }}
                                >
                                    Удалить все данные
                                </div>
                            </div>
                        </form>
                    </div>
                </>
            ) : (
                <>
                    <div style={{ textAlign: 'center', fontWeight: "bolder", marginBottom: '50px' }}>
                        Заполните свой профиль для простоты заказа
                    </div>
                    <form onSubmit={onRegistration}>
                        <label>
                            <div style={{ fontWeight: "bolder", marginTop: '15px' }}>Имя: </div>
                            <input 
                                id="name" className="input" type="text" name="name" 
                                value={formRegistration.name} onChange={handleChangeRegistration} required
                            />
                        </label>
                        <label>
                            <div style={{ fontWeight: "bolder", marginTop: '15px' }}>Номер телефона:</div>
                            <div style={{ position: 'relative' }}>
                                <InputMask
                                    className="input" name="phone" id="phone" type="tel" mask="+7(999)999-99-99"
                                    placeholder="+7(XXX)XXX-XX-XX" value={formRegistration.phone} 
                                    onChange={(e) =>{handleChangeRegistration(e); handleChange(e)}} required min={10} style={{ fontFamily: "monospace" }}
                                />
                                {errors.phone && <div className="errors">{errors.phone.message}</div>}
                            </div>
                        </label>
                        <label>
                            <div style={{ fontWeight: "bolder", marginTop: '15px' }}>
                                Адрес доставки: 
                            </div>
                            <div style={{ position: 'relative', display: 'flex' }}>
                                <textarea
                                    className="input" name="adres" id="adres"
                                    onChange={(e) =>{handleChangeRegistration(e); handleChange(e)}}
                                />
                                {errors.adres && <div className="errors">{errors.adres.message}</div>}   
                            </div>
                        </label>
                        <button className="button" type="submit" style={{ width: '100%', textTransform: 'uppercase', marginTop: '15px' }}>
                            Сохранить данные
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}

export default Client;
