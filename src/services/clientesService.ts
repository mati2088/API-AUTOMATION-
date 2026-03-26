import {APIRequestContext,APIResponse} from "@playwright/test"


export class ClientesService{

    private request:APIRequestContext;
    private baseURL:string
    
    constructor(request:APIRequestContext){
        this.request=request;
        this.baseURL="https://homebanking-demo.onrender.com"

    }


    async obtenerDatosCliente():Promise<APIResponse>{
       return await this.request.get(`${this.baseURL}/cliente/dashboard`)
    }
}