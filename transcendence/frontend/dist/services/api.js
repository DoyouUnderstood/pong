import { UnauthenticatedError, ConflictError, ServerError } from "../utils/Errors.js";
export class api {
    async customFetch(url, options) {
        const response = await fetch(url, {
            credentials: 'include',
            ...options
        });
        const json = await response.json();
        if (!response.ok) {
            const message = json.message || "Une erreur est survenue";
            switch (response.status) {
                case 401: throw new UnauthenticatedError(message);
                case 409: throw new ConflictError(message);
                default: throw new ServerError(message);
            }
        }
        return json;
    }
    async post(route, data) {
        const body = data !== undefined ? JSON.stringify(data) : JSON.stringify({});
        const response = await this.customFetch("/api/" + route, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        });
        return response;
    }
    async get(route) {
        const response = await this.customFetch("/api/" + route, {
            method: 'GET',
            credentials: 'include',
        });
        return response;
    }
}
export const Api = new api();
