import api from "frontend/services/api.ts";
import Cookies from 'universal-cookie';

interface TokenResponse {
    token: string
}


interface JwtPayload {
    exp: number
}

function decodeJwt(token: string): JwtPayload | null {
    try {
        const payloadBase64 = token.split('.')[1]
        const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
        return JSON.parse(payloadJson) as JwtPayload;
    } catch {
        return null
    }
}

class UserService {
    private cookies: Cookies;

    constructor() {
        this.cookies = new Cookies(null, {path: "/"});
    }

    public async register(username: string, email: string, password: string): Promise<string> {
        const response = await api.post<TokenResponse>("/user/register", {
            username, email, password
        });

        const token = response.data.token
        this.set_cookie(token);

        return token;
    }

    public async login(username: string, password: string): Promise<string> {
        const response = await api.post<TokenResponse>("/user/login", {
            username, password
        });
        const token = response.data.token
        this.set_cookie(token);

        return token;
    }

    public logout() {
        this.cookies.remove("jwt");
    }

    public isLoggedIn(): boolean {
        return !!this.cookies.get("jwt");
    }

    private set_cookie(token: string) {

        const decodedPayload = decodeJwt(token);

        if (decodedPayload) {
            const expireDate = new Date(decodedPayload.exp * 1000)

            this.cookies.set('jwt', token, {

                expires: expireDate, secure: true, sameSite: 'strict'
            })

        }

    }


}

export default new UserService();