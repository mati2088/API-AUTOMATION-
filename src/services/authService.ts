import { APIRequestContext, APIResponse } from "@playwright/test";

export class AuthService {
    private request: APIRequestContext;
    private baseURL: string;

    constructor(request: APIRequestContext) {
        this.request = request;
        this.baseURL = process.env.BASE_URL || 'https://homebanking-demo.onrender.com';
    }

    async getToken(email?: string, password?: string): Promise<string> {
        const auth_email = email || process.env.USER_EMAIL || 'demo';
        const auth_password = password || process.env.USER_PASSWORD || 'demo123';

        const response = await this.request.post(`${this.baseURL}/auth/login`, {
            data: { username: auth_email, password: auth_password },
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok()) {
            throw new Error(`Fallo al autenticar: ${response.status()}`);
        }

        const body = await response.json();
        return body.token;
    }
}
