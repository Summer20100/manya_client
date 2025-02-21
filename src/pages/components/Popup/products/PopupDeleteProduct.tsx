import { FC } from "react";
import { useProducts } from "../../../../store/products";
import { usePopup } from "../../../../store/popup";

const PopupDeleteProduct: FC = () => {
    const { removeProduct, product } = useProducts();
    const { isOpenHandler } = usePopup();
    const handleDelete = () => {
        if (product) {
            removeProduct(product.id);
            isOpenHandler(false);
        }
    };

    return (
        <>
            <div>Хотите удалить продукт?</div>
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

export default PopupDeleteProduct;
