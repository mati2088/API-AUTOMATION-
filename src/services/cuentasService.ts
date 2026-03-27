import {APIRequestContext,APIResponse} from "@playwright/test"


export class CuentasService{

    private request:APIRequestContext;
    private baseURL:string
    
    constructor(request:APIRequestContext){
        this.request=request;
        this.baseURL="https://homebanking-demo.onrender.com"

    }


    async obtenerCuentas():Promise<APIResponse>{
       return await this.request.get(`${this.baseURL}/cuentas/`)
    }
}