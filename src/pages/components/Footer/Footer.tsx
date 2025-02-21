import { FC } from "react";
import { useNavigate } from "react-router";
import { HiShoppingCart, HiHome, HiUser } from 'react-icons/hi';
import { useLocalStorageWatcher } from "../../../store/localStorage";


const Footer: FC = () => {
    const storageData = useLocalStorageWatcher();
    const navigate = useNavigate();

    const { ordersFromBasket } = storageData;
 
    return (
        <footer>
            <div className="home" onClick={() => navigate('/')}>
                <HiHome />
            </div>
            <div className="storage-basket" onClick={() => navigate('/orders')}>
                <HiShoppingCart />
                { ordersFromBasket.length !== 0 &&
                    <div className="storage-count">{ ordersFromBasket.length }</div>
                }
            </div>
            <div className="client" onClick={() => navigate('/client')}>
                <HiUser />
            </div>
        </footer>
    );
}

export default Footer;