export interface IBaseClient {
    name: string,
    phone: string,
}

export interface IClient extends IBaseClient {
    id: number;
    
}

export interface IClientLocalStorage extends IBaseClient {
    id: number;
    adres: string | null;
}

export interface IClientForUpdate extends IBaseClient {
    id: number;
    adres?: string | null;
}