import { FC, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useProducts } from "../../../store/products";
import Product from "./Product";

const Products: FC = () => {
    const { products, getProducts } = useProducts();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryId = Number(queryParams.get('categoryId'));

    useEffect(() => {
        getProducts();
    }, [getProducts]);

    const productsFilteredByCategory = products.filter(product => product.category_id === categoryId);

    return (
        <div className="categories">
            { products.length > 0
                ?
                productsFilteredByCategory.map((product) => (
                    <Product {...product} key={product.id} />
                ))

                :
                <h3>Нет пока ничего</h3>
            }
        </div>
        
    );
};

export default Products;
