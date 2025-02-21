export interface IBaseCategory {
    title: string;
    description?: string | null;
    img_URL?: string | null;
    img_title?: string | null;
}

export interface ICategory extends IBaseCategory {
    id: number;
}