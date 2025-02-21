export interface IBaseOrder {
    //client_id: number | null;
    client_phone: string | null;
    client_name: string | null;
    product_id: number;
    quantity: number;
    total_price: number;
    total_weight: number;
    adres: string;
    comment: string | null;
    is_active: boolean;
    date: string;
    created_at?: Date | null,
    updated_at?: Date | null,
}

export interface IOrder extends IBaseOrder {
    id: number;
}

export interface IOrderUpdate {
    id: number;
    //client_id: number | null;
    client_phone: string | null;
    client_name: string | null;
    product_id: number;
    quantity: number;
    total_price: number;
    total_weight: number;
    adres: string;
    comment: string | null;
    is_active: boolean;
    date: string;
    created_at?: Date | null,
    updated_at?: Date | null,
}

export interface IOrderWithoutClient {
    title_local: string;
    //client_id: number | null;
    client_phone: string | null;
    client_name: string | null;
    product_id: number;
    quantity: number;
    total_price: number;
    total_weight: number;
    adres: string | null;
    comment: string | null;
    is_active: boolean;
    date: string;
    created_at?: Date | null,
    updated_at?: Date | null,
}

export interface IOrderForLocalstorage {
    //title_local: string;
    //client_id: number | null;
    client_phone: string | null;
    client_name: string | null;
    product_id: number;
    quantity: number;
    total_price: number;
    total_weight: number;
    adres: string | null;
    comment: string | null;
    is_active: boolean;
    date: string;
    created_at?: Date | null,
    updated_at?: Date | null,
}
