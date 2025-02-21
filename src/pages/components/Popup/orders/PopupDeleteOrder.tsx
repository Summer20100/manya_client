import { FC } from "react";
import { usePopup } from "../../../../store/popup";
import { useOrders } from "../../../../store/orders";

const PopupDeleteOrder: FC = () => {
    const { removeOrder, order } = useOrders();
    const { isOpenHandler } = usePopup();
    const handleDelete = () => {
        if (order) {
            removeOrder(order.id);
            isOpenHandler(false);
        }
    };

    return (
        <>
            <div>Хотите удалить заказ?</div>
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

export default PopupDeleteOrder;
