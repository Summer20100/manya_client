export interface IBaseLogin {
    name: string,
    password: string
}

export interface ILogin extends IBaseLogin {
    id: number;
}
