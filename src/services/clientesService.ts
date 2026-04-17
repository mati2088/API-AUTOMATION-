import {APIRequestContext,APIResponse} from "@playwright/test"


export class ClientesService{

    private request:APIRequestContext;
    private baseURL:string
    
    constructor(request:APIRequestContext){
        this.request=request;
        this.baseURL=process.env.BASE_URL || 'https://homebanking-demo.onrender.com';

    }

    private get headers(): { [key: string]: string } {
        return process.env.TEST_TOKEN ? { Authorization: `Bearer ${process.env.TEST_TOKEN}` } : {};
    }

    async obtenerDatosCliente():Promise<APIResponse>{
       return await this.request.get(`${this.baseURL}/cliente/dashboard`, { headers: this.headers })
    }
}