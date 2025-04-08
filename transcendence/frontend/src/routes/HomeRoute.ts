import { RouteI } from "../interfaces/RouteInterface.js";

export class HomeRoute implements RouteI
{
    partial = 'home.html';
    authentification: "loginRequired" = "loginRequired";
    async setup(container: HTMLElement): Promise <void>
    {
        const event = addEventListener("click", () => {
            console.log("salut mon pote !")
        });
    }
}
