import {APIRequestContext,APIResponse} from "@playwright/test"


export class SistemasService{

    private request:APIRequestContext;
    private baseURL:string
    
    constructor(request:APIRequestContext){
        this.request=request;
        this.baseURL=process.env.BASE_URL || 'https://homebanking-demo.onrender.com';

    }

    private get headers(): { [key: string]: string } {
        return process.env.TEST_TOKEN ? { Authorization: `Bearer ${process.env.TEST_TOKEN}` } : {};
    }

    async resetearValores():Promise<APIResponse>{
       return await this.request.post(`${this.baseURL}/sistema/resetear`, { headers: this.headers })
    }
}