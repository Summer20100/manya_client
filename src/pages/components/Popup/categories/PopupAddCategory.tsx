import { FC, useState, useRef } from "react";
import { useCategories } from "../../../../store/categories";
import { usePopup } from "../../../../store/popup";

const PopupAddCategory: FC = () => {
    const { addCategory } = useCategories();
    const { isOpenHandler, addNamePopup } = usePopup();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const imgURLInput = document.querySelector('input[name="img_URL"]') as HTMLInputElement;

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        const title = formData.get("title")?.toString() || "";
        const description = formData.get("description")?.toString() || "";
        const img_title = formData.get("img_title")?.toString() || "";
        const img_URL: string | null = previewUrl;
        
        addCategory({
            title,
            description,
            img_URL,
            img_title,
        });
        
        addNamePopup('', '')
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
                placeholder="Название категории"
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
            <button className="button" type="submit">
                Отправить
            </button>
        </form>
    );
};

export default PopupAddCategory;
