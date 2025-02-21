import { FC, useState, useRef } from "react";
import { useProducts } from "../../../../store/products";
import { useCategories } from "../../../../store/categories";
import { usePopup } from "../../../../store/popup";

const PopupAddProduct: FC = () => {
    const { addProduct } = useProducts();

    const { isOpenHandler, addNamePopup } = usePopup();
    const { categories } = useCategories();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const imgURLInput = document.querySelector('input[name="img_URL"]') as HTMLInputElement;

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
    
        const title = formData.get("title")?.toString() || "";
        const description = formData.get("description")?.toString() || "";
        const img_title = formData.get("img_title")?.toString() || "";
    
        const price_for_itm = parseFloat(formData.get("price_for_itm")?.toString() || "0");
        const weight_for_itm = parseFloat(formData.get("weight_for_itm")?.toString() || "0");
        const category_id = formData.get("category_id") ? Number(formData.get("category_id")) : null;
        const is_active = formData.get("is_active") === "true";
    
        if (isNaN(price_for_itm) || isNaN(weight_for_itm)) {
            console.error("Цена или вес должны быть в формате 00.00");
            return;
        }

        const img_URL: string | null = previewUrl;
    
        addProduct({
            title,
            description,
            img_URL,
            img_title,
            price_for_itm,
            weight_for_itm,
            is_active,
            category_id,
        });
    
        addNamePopup("", "");
        isOpenHandler(false);
        setPreviewUrl(null);
        if (imgURLInput) imgURLInput.value = "";
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPreviewUrl(null);
        const file = event.target.files?.[0];
        if (file) {
            if (imgURLInput) imgURLInput.value = "";
            const reader = new FileReader();
            reader.onload = (e) => setPreviewUrl(e.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(event.target.value);
        }
    };
    
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(event.target.value) < 0) {
            event.target.value = "0";
        }
    };

    const [selectedCategory, setSelectedCategory] = useState<number | string>('');

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
        console.log('Selected category ID:', event.target.value);
    };

    const handleCancel = () => {
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (imgURLInput) imgURLInput.value = "";
    };


    return (
        <form className="form" onSubmit={onSubmit}>
            <input
                className="input"
                name="title"
                type="text"
                placeholder="Название продукта"
                required
            />
            <input
                className="input"
                name="description"
                type="text"
                placeholder="Описание"
            />

            <input
                className="input"
                name="img_URL"
                type="text"
                onChange={handleFileSelect}
                placeholder="URL-картинки"
            />
            <span style={{ margin: '-1.5rem' }}>или</span>
            <label htmlFor="fileInput" className="input add-btn" style={{ cursor: 'pointer' }}>
                Выберите файл
                <input
                    className="input"
                    name="img_file"
                    type="file"
                    id="fileInput"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
            </label>

            {previewUrl && (
                <div style={{ marginTop: "10px", position: 'relative' }}>
                    <img
                        src={previewUrl}
                        alt="Preview"
                    />
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="delete-button"
                    >
                        ✕
                    </button>
                </div>
            )}

            
            <input
                className="input"
                name="img_title"
                type="text"
                placeholder="Описание картинки"
            />
            <input
                className="input"
                name="price_for_itm"
                type="number"
                placeholder="Цена продукта"
                min={0}
                onInput={handleInput}
            />
            <input
                className="input"
                name="weight_for_itm"
                type="number"
                placeholder="Вес продукта"
                min={0}
                onInput={handleInput}
            />
            <label className="input" style={{ cursor: "pointer", backgroundColor: "white", textAlign: "left" }}>
                <input
                    
                    name="is_active"
                    type="checkbox"
                />
                <span style={{ marginLeft: "10px" }}>В продажу</span>
            </label>

            <select
                className="input"
                name="category_id"
                value={selectedCategory}
                onChange={handleChange}
            >
                <option value=''>
                    Категория
                </option>
                { categories.map((category) => (
                    <option key={category.id} value={ category.id }>
                        { category.title }
                    </option>
                ))}
            </select>



            <button className="button" type="submit">
                Отправить
            </button>
        </form>
    );
};

export default PopupAddProduct;
