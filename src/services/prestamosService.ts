import { APIRequestContext, APIResponse } from "@playwright/test";



export class PrestamosService{
    private request: APIRequestContext
    private baseURL:string

    constructor(request:APIRequestContext){
        this.request=request
        this.baseURL=process.env.BASE_URL!
    }
 
    async altaPrestamo(cuenta_destino:string, cuotas:number, monto:number):Promise<APIResponse>{
        return this.request.post(`${this.baseURL}/prestamos/`,{
            data:{
                cuenta_destino,
                cuotas,
                monto
            }
        })
    }

    //desistir prestamos
    //obtener prestamos

    
}