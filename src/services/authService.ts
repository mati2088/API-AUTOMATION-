import { APIRequestContext, APIResponse } from "@playwright/test";

export class AuthService {
  constructor(private request: APIRequestContext, private baseURL: string) {}

  async login(username: string, password: string): Promise<string> {
    const response: APIResponse = await this.request.post(`${this.baseURL}/auth/login`, {
      data: {
        username,
        password,
      },
    });

    if (response.status() !== 200) {
      throw new Error(`Login falló. Status: ${response.status()}`);
    }

    const body = await response.json();

    if (!body.token) {
      throw new Error("Login sin token en la respuesta");
    }

    return body.token;
  }
}