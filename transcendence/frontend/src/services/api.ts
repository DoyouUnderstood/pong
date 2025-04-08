export class api 
{
    async post(route: string)
    {
        const response = await fetch("api/" + route);
        const data = await response.json();
        return data;
    }
}
