export class api {
    async post(route) {
        const response = await fetch("api/" + route);
        const data = await response.json();
        return data;
    }
}
