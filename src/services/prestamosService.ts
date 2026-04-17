import { APIRequestContext, APIResponse } from "@playwright/test";



export class PrestamosService{
    private request: APIRequestContext
    private baseURL:string

    constructor(request:APIRequestContext){
        this.request=request
        this.baseURL=process.env.BASE_URL || 'https://homebanking-demo.onrender.com'
    }
    private get headers(): { [key: string]: string } {
        return process.env.TEST_TOKEN ? { Authorization: `Bearer ${process.env.TEST_TOKEN}` } : {};
    }

    async altaPrestamo(cuenta_destino:string, cuotas:number, monto:number):Promise<APIResponse>{
        return this.request.post(`${this.baseURL}/prestamos/`,{
            headers: this.headers,
            data:{
                cuenta_destino,
                cuotas,
                monto
            }
        })
    }

    async obtenerPrestamos():Promise<APIResponse>{
        return this.request.get(`${this.baseURL}/prestamos/`, { headers: this.headers });
    }

}