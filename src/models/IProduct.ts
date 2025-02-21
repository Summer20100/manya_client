export interface IBaseProduct {
    title: string;
    description?: string | null;
    img_URL?: string | null;
    img_title?: string | null;
    price_for_itm?: number | null;
    weight_for_itm?: number | null;
    is_active?: boolean | null;
    category_id?: number | null;
}

export interface IProduct extends IBaseProduct {
    id: number;
}
