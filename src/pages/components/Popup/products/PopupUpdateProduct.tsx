import { FC, useEffect, useState, useRef } from "react";
import { useProducts } from "../../../../store/products";
import { useCategories } from "../../../../store/categories";
import { usePopup } from "../../../../store/popup";

const PopupUpdateProduct: FC = () => {
    const { updateProduct, product } = useProducts();
    const { isOpenHandler, addNamePopup } = usePopup();
    const { categories } = useCategories();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formState, setFormState] = useState({
        id: product?.id || 0,
        title: product?.title || "",
        description: product?.description || "",
        img_URL: product?.img_URL || "",
        img_title: product?.img_title || "",
        price_for_itm: product?.price_for_itm || 0,
        weight_for_itm: product?.weight_for_itm || 0,
        is_active: product?.is_active || false,
        category_id: product?.category_id || null,
    });

    useEffect(() => {
        setFormState({
            id: product?.id || 0,
            title: product?.title || "",
            description: product?.description || "",
            img_URL: product?.img_URL || "",
            img_title: product?.img_title || "",
            price_for_itm: product?.price_for_itm || 0,
            weight_for_itm: product?.weight_for_itm || 0,
            is_active: product?.is_active || false,
            category_id: product?.category_id || null,
        });
        setPreviewUrl(product?.img_URL || null);
    }, [product]);

    useEffect(() => {
        if (formState.img_URL) {
            setPreviewUrl(formState.img_URL);
        }
    }, [formState.img_URL]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
    
        setFormState((prevState) => ({
            ...prevState,
            [name]: type === "checkbox" && e.target instanceof HTMLInputElement
                ? e.target.checked
                : name === "category_id"
                    ? (value === "" ? null : Number(value))
                    : value
        }));
    
        if (name === "img_URL") {
            setPreviewUrl(value);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
                setFormState((prevState) => ({
                    ...prevState,
                    img_URL: e.target?.result as string,
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(formState.img_URL);
        }
    };

    const handleCancel = () => {
        console.log("QWERTY")
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        setFormState((prevState) => ({
            ...prevState,
            img_URL: ''
        }));
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        updateProduct(formState);
        addNamePopup("", "");
        isOpenHandler(false);
    };

    return (
        <form className="form" onSubmit={onSubmit}>
            <input name="id" type="hidden" value={formState.id} />
            <input
                className="input"
                name="title"
                type="text"
                placeholder="Название продукта"
                value={formState.title}
                onChange={onChange}
                required
            />
            <input
                className="input"
                name="description"
                type="text"
                placeholder="Описание"
                value={formState.description}
                onChange={onChange}
            />

            <input
                className="input"
                name="img_URL"
                type="text"
                placeholder="URL-картинки"
                value={formState.img_URL}
                onChange={onChange}
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
                    ref={fileInputRef}
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
                value={formState.img_title}
                onChange={onChange}
            />
            <input
                className="input"
                name="price_for_itm"
                type="number"
                placeholder="Цена продукта"
                value={formState.price_for_itm}
                min={0}
                onChange={onChange}
            />
            <input
                className="input"
                name="weight_for_itm"
                type="number"
                placeholder="Вес продукта"
                value={formState.weight_for_itm}
                min={0}
                onChange={onChange}
            />
            <label
                className="input"
                style={{ backgroundColor: "white", textAlign: "left" }}
            >
                <input
                    name="is_active"
                    type="checkbox"
                    checked={formState.is_active}
                    onChange={onChange}
                />
                <span style={{ marginLeft: "10px" }}>В продажу</span>
            </label>

            <select
                className="input"
                name="category_id"
                value={formState.category_id || ""}
                onChange={onChange}
            >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.title}
                    </option>
                ))}
            </select>

            <button className="button" type="submit">
                Обновить
            </button>
        </form>
    );
};

export default PopupUpdateProduct;