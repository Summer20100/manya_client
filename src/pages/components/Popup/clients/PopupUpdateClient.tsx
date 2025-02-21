import { FC, useEffect } from "react";
import { useClients } from "../../../../store/clients";
import { usePopup } from "../../../../store/popup";
import InputMask from "react-input-mask";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IClient } from "../../../../models/IClient";

// Validation schema
const schema = yup.object().shape({
    id: yup.number().required(),
    name: yup
        .string()
        .required("Введите имя")
        .min(3, "Минимум 3 символа"),
    phone: yup
        .string()
        .matches(/\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/, "Некорректный формат номера")
        .required("Телефон обязателен для заполнения"),
});

const PopupUpdateClient: FC = () => {
    const { updateClient, client, clients } = useClients();
    const { isOpenHandler, addNamePopup } = usePopup();
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm<IClient>({
        mode: "all",
        resolver: yupResolver(schema),
    });

    // Reset form with client data when client is set
    useEffect(() => {
        if (client) {
            reset({
                id: client.id,
                name: client.name,
                phone: client.phone,
            });
        }
    }, [client, reset]);

    // Handle phone input changes, format and validate
    const onChangePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        let formattedPhone = value.replace(/\D/g, ""); // Remove non-numeric characters
        formattedPhone = `+7${formattedPhone.slice(1)}`; // Format as +7XXXXXXXXXX
        
        // Check if the phone already exists
        const isClientExists = clients.some((c) => c.phone === formattedPhone);
        
        if (isClientExists) {
            setError("phone", { type: "manual", message: "Клиент с таким номером уже существует" });
        } else {
            setError("phone", { type: "manual", message: "" });
        }
    };

    // Handle form submission
    const onSubmit = (data: IClient) => {
        const phone = data.phone.replace(/\D/g, ""); // Remove non-numeric characters
        const formattedPhone = `+7${phone.slice(1)}`; // Format as +7XXXXXXXXXX

        // Check if the phone number is already taken (but not if the same as before)
        if (client?.phone !== formattedPhone) {
            const isClientExists = clients.some((c) => c.phone === formattedPhone);
            if (isClientExists) {
                setError("phone", { type: "manual", message: "Клиент с таким номером уже существует" });
                return;
            }
        }

        // Update client data
        updateClient({
            ...data,
            phone: formattedPhone,
        });

        // Close the popup and reset the form
        addNamePopup("", "");
        isOpenHandler(false);
    };

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
                    onChange={onChangePhone}
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

export default PopupUpdateClient;
