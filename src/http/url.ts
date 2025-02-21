export class URL {
  /* Onrender */
  static readonly urlOnrenderCategories: string = import.meta.env.VITE_ENV_URL_ONRENDER_CATEGORIES || '';
  static readonly urlOnrenderProducts: string = import.meta.env.VITE_ENV_URL_ONRENDER_PRODUCTS || '';
  static readonly urlOnrenderOrders: string = import.meta.env.VITE_ENV_URL_ONRENDER_ORDERS || '';
  static readonly urlOnrenderClients: string = import.meta.env.VITE_ENV_URL_ONRENDER_CLIENTS || '';
  static readonly urlOnrenderUsers: string = import.meta.env.VITE_ENV_URL_ONRENDER_USERS || '';
  static readonly urlOnrenderRegister = import.meta.env.VITE_ENV_URL_ONRENDER_BASE + import.meta.env.VITE_ENV_REGISTER_KEY + '/register' || '';
  static readonly urlOnrenderDeleteUserById = import.meta.env.VITE_ENV_URL_ONRENDER_BASE + import.meta.env.VITE_ENV_DELETE_KEY + '/users/' || '';
  static readonly urlOnrenderLogin: string = import.meta.env.VITE_ENV_URL_ONRENDER_LOGIN || '';
  static readonly urlOnrenderValidate: string = import.meta.env.VITE_ENV_URL_ONRENDER_VALIDATE || '';

  /* Localserver */
  static readonly urlLocalserverCategories: string = import.meta.env.VITE_ENV_URL_LOCALSERVER_CATEGORIES || '';
  static readonly urlLocalserverProducts: string = import.meta.env.VITE_ENV_URL_LOCALSERVER_PRODUCTS || '';
  static readonly urlLocalserverOrders: string = import.meta.env.VITE_ENV_URL_LOCALSERVER_ORDERS || '';
  static readonly urlLocalserverClients: string = import.meta.env.VITE_ENV_URL_LOCALSERVER_CLIENTS || '';
  static readonly urlLocalserverUsers: string = import.meta.env.VITE_ENV_URL_LOCALSERVER_USERS || '';
  static readonly urlLocalserverRegister = import.meta.env.VITE_ENV_URL_LOCALSERVER_BASE + import.meta.env.VITE_ENV_REGISTER_KEY + '/register' || '';
  static readonly urlLocalserverDeleteUserById = import.meta.env.VITE_ENV_URL_LOCALSERVER_BASE + import.meta.env.VITE_ENV_DELETE_KEY + '/users/' || '';
  static readonly urlLocalserverLogin: string = import.meta.env.VITE_ENV_URL_LOCALSERVER_LOGIN || '';
  static readonly urlLocalserverValidate: string = import.meta.env.VITE_ENV_URL_LOCALSERVER_VALIDATE || '';

  /* With JWT */
  static readonly urlJWTbaseURL: string = import.meta.env.VITE_ENV_URL_JWT_BASEURL || '';

  static readonly urlJWTCategories: string = import.meta.env.VITE_ENV_URL_JWT_CATEGORIES || '';
  static readonly urlJWTProducts: string = import.meta.env.VITE_ENV_URL_JWT_PRODUCTS || '';
  static readonly urlJWTOrders: string = import.meta.env.VITE_ENV_URL_JWT_ORDERS || '';
  static readonly urlJWTClients: string = import.meta.env.VITE_ENV_URL_JWT_CLIENTS || '';
  static readonly urlJWTUsers: string = import.meta.env.VITE_ENV_URL_JWT_USERS || '';
  static readonly urlJWTLogin: string = import.meta.env.VITE_ENV_URL_JWT_LOGIN || '';
  static readonly urlJWTValidate: string = import.meta.env.VITE_ENV_URL_JWT_VALIDATE || '';

}

export class KEY {
  /* Sectet KEYs */
  static readonly regKey: string = import.meta.env.VITE_ENV_REGISTER_KEY || '';
  static readonly delKey: string = import.meta.env.VITE_ENV_DELETE_KEY || '';
}
