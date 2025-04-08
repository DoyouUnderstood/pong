import { RouteI } from "../interfaces/RouteInterface.js";

export class SignupRoute implements RouteI
{
    partial = "signup.html";
    authentification: "loginNotRequired" = "loginNotRequired";
    async setup (container: HTMLElement): Promise <void>
    {
        console.log("bienvenue dans signup!");
    }
}
