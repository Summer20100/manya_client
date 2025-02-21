import { FC, useState } from "react";
import { useProducts } from "../../../../store/products";
import { usePopup } from "../../../../store/popup";
import { useOrders } from "../../../../store/orders";
import { useClients } from "../../../../store/clients";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IBaseOrder } from "../../../../models/IOrder";
import * as yup from "yup";

const schema = yup.object({
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
        .typeError("")
        .min(1, "Количество должно быть больше нуля")
        .default(1),
    total_price: yup.number().typeError("").default(0),
    total_weight: yup.number().typeError("").default(0),
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
        .default("     "),
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

const PopupAddOrder: FC = () => {
    const { getProductById, products, product } = useProducts();
    const { clients } = useClients();
    const { addOrder } = useOrders();
    const { isOpenHandler, addNamePopup } = usePopup();

    const { 
        register,
        handleSubmit, 
        formState: { errors },
        setValue
    } = useForm<IBaseOrder>({
        mode: "all",
        resolver: yupResolver(schema),
    });

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(event.target.value) < 0) {
            event.target.value = "0";
        }
    };

    const [selectedClient, setSelectedClient] = useState<number | string>('');
    const [selectedProduct, setSelectedProduct] = useState<number | string>('');
    const [quantity, setQuantity] = useState<number | string>(1);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {   
        const { name, value } = event.target;
        if (name === 'client_id') {
            setSelectedClient(value);
        } else if (name === 'product_id') {
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

    const onSubmit  = (data: IBaseOrder) => {
        const updatedData: IBaseOrder = {
            ...data,
            quantity: data.quantity ?? 1,
            total_price: data.total_price ?? 0,
            total_weight: data.total_weight ?? 0,
            comment: data.comment?.length ? data.comment : '     ',
        };

        addOrder(updatedData);
        addNamePopup("", "");
        isOpenHandler(false);
    };

    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div style={{ position: 'relative' }}>
                <select
                    className="input"
                    //name="client_id"
                    {...register('client_id')}
                    value={selectedClient}
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
                    //name="product_id"
                    {...register('product_id')}
                    value={selectedProduct}
                    onChange={handleChange}
                >
                    <option value=''>
                        Название продукта
                    </option>
                    { products.map((product) => (
                        <option key={product.id} value={ product.id }>
                            { product.title }
                        </option>
                    ))}
                </select>
                {errors.product_id && <div className="errors">{errors.product_id.message}</div>}
            </div>


            <div style={{ position: 'relative' }}>
                <input
                    className="input"
                    //name="quantity"
                    {...register('quantity')}
                    type="number"
                    placeholder="Количество"
                    min={1}
                    value={product && selectedProduct ? quantity : ''}
                    onChange={handleChange}
                    onInput={handleInput}
                />
                {errors.quantity && <div className="errors">{errors.quantity.message}</div>}
            </div>


            <input
                className="input"
                //name="total_price"
                {...register('total_price')}
                type="number"
                placeholder="Цена заказа"
                value={product && selectedProduct ? Number(quantity) * Number(product?.price_for_itm) : ''}
                onInput={handleInput}
                disabled
            />

            <input
                className="input"
                //name="total_weight"
                {...register('total_weight')}
                type="number"
                placeholder="Вес заказа"
                value={product && selectedProduct ? Number(quantity) * Number(product?.weight_for_itm) : ''}
                onInput={handleInput}
                disabled
            />


            <div style={{ position: 'relative', display: 'flex' }}>
                <textarea
                    className="input"
                    placeholder="Адрес доставки"
                    {...register('adres')}
                />
                {errors.adres && <div className="errors">{errors.adres.message}</div>}
            </div>

            <div style={{ position: 'relative', display: 'flex' }}>
                <textarea
                    className="input"
                    //name="comment"
                    {...register('comment')}
                    placeholder="Комментарии"
                />
                {errors.comment && <div className="errors">{errors.comment.message}</div>}
            </div>

            <div style={{ position: 'relative', display: 'none' }} >
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
                        //name="is_active"
                        //className="input" 
                        {...register('is_active')}
                        defaultChecked={false}
                        type="checkbox"
                    />
                    <span style={{ marginLeft: "10px" }}>Статус</span>
                </label>
            </div>

            <div style={{ position: 'relative' }}>
                <input
                    className="input"
                    //name="date"
                    {...register('date')}
                    type="date"
                    placeholder="Дата доставки"
                    defaultValue={new Date().toISOString().split("T")[0]}
                />
                {errors.date && <div className="errors">{errors.date.message}</div>}
            </div>


            <button className="button" type="submit">
                Отправить
            </button>
        </form>
    );
};

export default PopupAddOrder;
