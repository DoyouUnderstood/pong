export class api {
    async customFetch(url, options) {
        const response = await fetch(url, options);
        if (!response.ok) {
            console.error("Erreur HTTP:", response.status);
            return null;
        }
        return await response.json();
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
