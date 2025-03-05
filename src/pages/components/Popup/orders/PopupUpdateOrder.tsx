/* import { FC, useEffect, useState } from "react";
import { useProducts } from "../../../../store/products";
import { useOrders } from "../../../../store/orders";
import { useClients } from "../../../../store/clients";
import { usePopup } from "../../../../store/popup";
import { IOrderUpdate } from "../../../../models/IOrder";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
    id: yup
        .number()
        .required(),
    client_id: yup
        .number()
        .required("Выберите клиента")
        .typeError("Выберите клиента")
        .positive("Некорректный client_id"),
    product_id: yup
        .number()
        .required("Выберите продукт")
        .typeError("Выберите продукт")
        .positive("Некорректный product_id"),
    quantity: yup
        .number()
        .typeError("Количество должно быть числом")
        .min(1, "Количество должно быть больше нуля")
        .default(1),
    total_price: yup.number().typeError("Цена должна быть числом").default(0),
    total_weight: yup.number().typeError("Вес должен быть числом").default(0),
    is_active: yup.boolean().default(false),
    adres: yup.string()
        .required("Заполните адрес")
        .min(5, "Должно быть не менее 5 символов"),
    comment: yup
        .string()
        .notRequired()
        .when({
            is: (val: string) => val?.length > 0,
            then: (schema) => schema.min(5, "Должно быть не менее 5 символов"),
        })
        .default(""),
    date: yup
        .string()
        .required("Выберите дату")
        .test("is-future-date", "Дата должна быть не раньше сегодня", (value) => {
            if (!value) return false;
            const selectedDate = new Date(value);
            const today = new Date();
            selectedDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            return selectedDate >= today;
        }),
}).required();

const PopupUpdateOrder: FC = () => {
    const { updateOrder, order } = useOrders();
    const { isOpenHandler, addNamePopup } = usePopup();
    const { clients } = useClients();
    const { getProductById, product, products } = useProducts();

    const { 
        register,
        handleSubmit, 
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm<IOrderUpdate>({
        mode: "all",
        resolver: yupResolver(schema),
    });

    const totalPrice = watch("total_price");
    const totalWeight = watch("total_weight");
    
    useEffect(() => {
        if (order) {
            reset({
                id: order.id,
                client_id: order.client_id,
                product_id: order.product_id,
                quantity: order.quantity,
                total_price: order.total_price,
                total_weight: order.total_weight,
                is_active: order.is_active,
                adres: order.adres,
                comment: order.comment || "",
                date: order.date
            });
        }
    }, [reset, order]);

    const onSubmit = (data: IOrderUpdate) => {
        updateOrder(data);
        addNamePopup("", "");
        isOpenHandler(false);
    };

   
    const [selectedProduct, setSelectedProduct] = useState<number | string>('');
    const [quantity, setQuantity] = useState<number | string>(1);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {   
        const { name, value } = event.target;
        
        if (name === 'product_id') {
            setSelectedProduct(value);
            if (value) {
                getProductById(Number(value));
                const price = product?.price_for_itm || 0;
                const weight = product?.weight_for_itm || 0;
                const calculatedPrice = Number(quantity) * price;
                const calculatedWeight = Number(quantity) * weight;
                setValue("total_price", calculatedPrice);
                setValue("total_weight", calculatedWeight);
            }
        } else if (name === 'quantity') {
            setQuantity(Number(value));
            if (selectedProduct) {
                const price = product?.price_for_itm || 0;
                const weight = product?.weight_for_itm || 0;
                const calculatedPrice = Number(value) * price;
                const calculatedWeight = Number(value) * weight;
                setValue("total_price", calculatedPrice);
                setValue("total_weight", calculatedWeight);
            }
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div style={{ position: 'relative' }}>
                <select
                    className="input"
                    {...register('client_id')}
                    onChange={handleChange}
                >
                    <option value=''>
                        Номер телефона клиента
                    </option>
                    { clients.map((client) => (
                        <option key={client.id} value={ client.id }>
                            { client.phone }
                        </option>
                    ))}
                </select>
                {errors.client_id && <div className="errors">{errors.client_id.message}</div>}
            </div>

            <div style={{ position: 'relative' }}>
                <select
                    className="input"
                    {...register('product_id')}
                    onChange={handleChange}
                >
                    <option value=''>
                        Название продукта
                    </option>
                    { products.map((product) => (
                        <option 
                            key={product.id} 
                            value={ product.id } 
                        >
                            { product.title }
                        </option>
                    ))}
                </select>
                {errors.product_id && <div className="errors">{errors.product_id.message}</div>}
            </div>

            <div style={{ position: 'relative' }}>
                <input
                    className="input"
                    {...register('quantity')}
                    type="number"
                    placeholder="Количество"
                    onChange={handleChange}
                    min={1}
                />
                {errors.quantity && <div className="errors">{errors.quantity.message}</div>}
            </div>

            <input
                className="input"
                {...register('total_price')}
                type="number"
                placeholder="Цена заказа"
                value={totalPrice || 0}
                disabled
            />

            <input
                className="input"
                {...register('total_weight')}
                type="number"
                placeholder="Вес заказа"
                value={totalWeight || 0}
                disabled
            />

            <div style={{ position: 'relative', display: 'flex' }}>
                <textarea 
                    className="input"
                    {...register('adres')}
                    placeholder="Адрес доставки" 
                />
                {errors.adres && <div className="errors">{errors.adres.message}</div>}
            </div>

            <div style={{ position: 'relative', display: 'flex' }}>
                <textarea 
                    className="input"
                    {...register('comment')}
                    placeholder="Комментарии" 
                />
                {errors.comment && <div className="errors">{errors.comment.message}</div>}
            </div>

            <div style={{ position: 'relative' }} >
                <label 
                    className="input" 
                    style={{ 
                        width: "100%",
                        cursor: "pointer",
                        backgroundColor: "white",
                        textAlign: "left",
                        display: "flex",
                    }}
                >
                    <input 
                        {...register('is_active')} 
                        type="checkbox" 
                    />
                    <span style={{ marginLeft: "10px" }}>Статус</span>
                </label>
            </div>

            <div style={{ position: 'relative' }}>
                <input 
                    className="input" 
                    {...register('date')} 
                    type="date"
                    placeholder="Дата доставки"
                />
                {errors.date && <div className="errors">{errors.date.message}</div>}
            </div>

            <button className="button" type="submit">
                Обновить
            </button>
        </form>
    );
};

export default PopupUpdateOrder; */