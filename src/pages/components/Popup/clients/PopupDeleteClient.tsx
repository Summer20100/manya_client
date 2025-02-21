import { FC } from "react";
import { useClients } from "../../../../store/clients";
import { usePopup } from "../../../../store/popup";

const PopupDeleteClient: FC = () => {
    const { removeClient, client } = useClients();
    const { isOpenHandler } = usePopup();
    const handleDelete = () => {
        if (client) {
            removeClient(client.id);
            isOpenHandler(false);
        }
    };

    return (
        <>
            <div>Хотите удалить клиента?</div>
            <button 
                className="delete-button" 
                onClick={() => handleDelete()} 
                style={{ marginTop: '1.5rem'}}
            >
                Да, хочу
            </button>
        </>
    );
};

export default PopupDeleteClient;
