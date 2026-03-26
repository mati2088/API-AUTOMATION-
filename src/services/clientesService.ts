import {APIRequestContext,APIResponse} from "@playwright/test"


export class ClientesService{

    private request:APIRequestContext;
    private baseURL:string
    
    constructor(request:APIRequestContext){
        this.request=request;
        this.baseURL="https://homebanking-demo.onrender.com"

    }


    async obtenerDatosCliente(token: string):Promise<APIResponse>{
       return await this.request.get(`${this.baseURL}/cliente/dashboard`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}