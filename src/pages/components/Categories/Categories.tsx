import { FC, useEffect } from "react";
import { useCategories } from "../../../store/categories";
import { useProducts } from "../../../store/products";

import Category from "./Category";

const Categories: FC = () => {
    const { categories, getCategories } = useCategories();
    const{ products } = useProducts();

    const isCategoryEmpty = () => {
        return products.some(prod =>  prod.is_active);
    };

    
    useEffect(() => {
      getCategories()
    }, [getCategories])
  
    return (
        <>
            { categories.length > 0 && isCategoryEmpty()
                ?
                <div className="catgories">
                    {
                        categories.map((category, ind) => <Category {...category} key={category.id || ind}/>)
                    }
                </div>
                :
                <h3>Нет пока ничего</h3>
            }
        </>
        
    );
}

export default Categories;