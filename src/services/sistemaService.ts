import {APIRequestContext,APIResponse} from "@playwright/test"


export class SistemasService{

    private request:APIRequestContext;
    private baseURL:string
    
    constructor(request:APIRequestContext){
        this.request=request;
        this.baseURL=process.env.BASE_URL!

    }


    async resetearValores():Promise<APIResponse>{
       return await this.request.post(`${this.baseURL}/sistema/resetear`)
    }
}