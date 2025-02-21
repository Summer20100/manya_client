import { FC } from "react";
import { useClients } from "../../../../store/clients";
import { usePopup } from "../../../../store/popup";
import InputMask from "react-input-mask";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
    name: yup
    .string()
    .required("Введите имя")
    .min(3, "Минимум 3 символа"),
    phone: yup
        .string()
        .matches(/\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/, "Некорректный формат номера")
        .required("Телефон обязателен для заполнения"),
});


const PopupAddClient: FC = () => {
    const { addClient, clients } = useClients();
    const { isOpenHandler, addNamePopup } = usePopup();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({ 
        mode: 'all',
        resolver: yupResolver(schema),
        context: { clients }
    });

    const onSubmit = (data: { name: string; phone: string }) => {
        let phone = data.phone.replace(/\D/g, ""); // Убираем все нецифровые символы
        phone = `+7${phone.slice(1)}`; // Форматируем под +7XXXXXXXXXX

        const isClientExists = clients.find((client) => client.phone === phone);
        if (isClientExists) {
            setError("phone", { type: "manual", message: "Клиент с таким номером уже существует" });
            return;
        }

        addClient({ name: data.name, phone });
        addNamePopup('', '');
        isOpenHandler(false);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        let phone = value.replace(/\D/g, "");
        phone = `+7${phone.slice(1)}`;
        const isClientExists = clients.find(c => phone === c.phone);

        if (isClientExists) {
            setError("phone", { type: "manual", message: "Клиент с таким номером уже существует" });
            return;
        } else {
            setError("phone", { type: "manual", message: "" });
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div style={{ position: 'relative' }}>
                <input
                    className="input"
                    {...register("name")}
                    type="text"
                    placeholder="Имя клиента"
                    required
                />
                {errors.name && <div className="errors">{errors.name.message}</div>}
            </div>

            <div style={{ position: 'relative' }}>
                <InputMask
                    className="input"
                    {...register("phone")}
                    type="tel"
                    mask="+7(999)999-99-99"
                    onChange={onChange}
                    placeholder="+7(XXX)XXX-XX-XX"
                    required
                    style={{ fontFamily: "monospace" }}
                />
                {errors.phone && <div className="errors">{errors.phone.message}</div>}
            </div>

            <button className="button" type="submit">
                Отправить
            </button>
        </form>
    );
};

export default PopupAddClient;
