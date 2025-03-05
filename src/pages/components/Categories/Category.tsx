import { FC } from "react";
import { useNavigate } from "react-router";
import { ICategory } from "../../../models/ICategory";
import { useCategories } from "../../../store/categories";
import { useProducts } from "../../../store/products";

const Category: FC<ICategory> = (category) => {
    const { id, title, description, img_URL, img_title } = category;
    const { getCategoryById } = useCategories();
    const img_URL_no_photo = "/img/no_photo.jpg";

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/products?categoryId=${id}`);
    };

    const{ products } = useProducts();

    const isCategoryEmpty = (id: number) => {
        return products.some(prod => prod.category_id === id && prod.is_active);
    };

    return (
        <>
            { isCategoryEmpty(id) &&
                <div className="category" onClick={handleClick}>
                    <div className="title">{title}</div>
        
                    { img_URL && img_URL.trim() ? (
                        <div 
                            className="img" 
                            onClick={() => {
                                getCategoryById(id)
                        }}>
                            <img 
                                src={img_URL === '' ? img_URL_no_photo : img_URL} 
                                alt={img_title || "Изображение категории"} 
                                title={img_title || "Изображение категории"} 
                            />
                        </div>
                    ) : (
                        <div 
                            className="img" 
                            onClick={() => {
                                getCategoryById(id)
                        }}>
                            <img 
                                src={img_URL_no_photo} 
                                alt={img_title || "Изображение отсутствует"} 
                                title={img_title || "Изображение отсутствует"} 
                            />
                        </div>
                    )}
        
                    <div className="description">{description}</div>
                </div>
            }
        </>
        
    );
}

export default Category;