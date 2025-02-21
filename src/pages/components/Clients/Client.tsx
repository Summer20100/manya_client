import { FC } from "react";
import { IClient } from "../../../models/IClient";
import { useClients } from "../../../store/clients";
import { usePopup } from "../../../store/popup";

interface ProductProps extends IClient {
    index: number;
}

const Product: FC<ProductProps> = ({
    id,
    name,
    phone,
    index
}) => {
   
    const { isOpenHandler, addNamePopup } = usePopup();
    const { getClientById } = useClients();

    return (
        <tr key={id}>
            <td>{index + 1}</td>
            
            <td>{name}</td>
            <td>{phone}</td>
            <td>
                <button
                    className="edit-button"
                    onClick={() => {
                        isOpenHandler(true);
                        addNamePopup("UpdateClient", "Обновить клиента");
                        getClientById(id);
                    }}
                >
                ✏️
                </button>
                <button
                    className="delete-button"
                    onClick={() => {
                        isOpenHandler(true);
                        addNamePopup("RemoveClient", "Удалить клиента");
                        getClientById(id);
                    }}
                >
                ✕
                </button>
            </td>
        </tr>
    );
}

export default Product;