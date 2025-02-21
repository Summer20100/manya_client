import { FC } from "react";
import { useNavigate } from "react-router";


const Header: FC = () => {
    const navigate = useNavigate();

    return (
        <header onClick={() => navigate('/')}>
        </header>
    );
}

export default Header;