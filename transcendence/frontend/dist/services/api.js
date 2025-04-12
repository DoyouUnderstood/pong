import { UnauthenticatedError, ConflictError, ServerError } from "../utils/Errors.js";
export class api {
    async customFetch(url, options) {
        const response = await fetch(url, options);
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
        const response = await this.customFetch("/api/" + route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data ? JSON.stringify(data) : undefined
        });
        return response;
    }
}
export const Api = new api();
