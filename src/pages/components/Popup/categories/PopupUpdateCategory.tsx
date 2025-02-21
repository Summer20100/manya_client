import { FC, useEffect, useState, useRef } from "react";
import { useCategories } from "../../../../store/categories";
import { usePopup } from "../../../../store/popup";

const PopupUpdateCategory: FC = () => {
    const { updateCategory, category } = useCategories();
    const { isOpenHandler, addNamePopup } = usePopup();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(category?.img_URL || null);
    
    const [formState, setFormState] = useState({
        id: category?.id || 0,
        title: category?.title || "",
        description: category?.description || "",
        img_URL: category?.img_URL || "",
        img_title: category?.img_title || "",
    });

    useEffect(() => {
        setFormState({
            id: category?.id || 0,
            title: category?.title || "",
            description: category?.description || "",
            img_URL: category?.img_URL || "",
            img_title: category?.img_title || "",
        });
        setPreviewUrl(category?.img_URL || null);
    }, [category]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        if (name === "img_URL") {
            setPreviewUrl(value);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPreviewUrl(null);
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setPreviewUrl(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleCancel = () => {
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        updateCategory({ ...formState, img_URL: previewUrl });
        addNamePopup('', '');
        isOpenHandler(false);
    };

    return (
        <form className="form" onSubmit={onSubmit}>
            <input name="id" type="hidden" value={formState.id} />
            <input
                className="input"
                name="title"
                type="text"
                placeholder="Название категории"
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
                onChange={onChange}
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
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
            </label>
            {previewUrl && (
                <div style={{ marginTop: "10px", position: 'relative' }}>
                    <img src={previewUrl} alt="Preview" />
                    <button type="button" onClick={handleCancel} className="delete-button">
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
            <button className="button" type="submit">
                Отправить
            </button>
        </form>
    );
};

export default PopupUpdateCategory;
