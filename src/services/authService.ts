import { APIRequestContext } from "@playwright/test";

export class AuthService {
    private request: APIRequestContext;
    private baseURL = "https://homebanking-demo.onrender.com";

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async getToken(email: string, password: string): Promise<string> {
        const response = await this.request.post(`${this.baseURL}/auth/login`, {
            data: { email, password }
        });
        const body = await response.json();
        console.log('Login response:', JSON.stringify(body, null, 2));
        return body.token; // ajustar segun el campo real del response
    }
}
