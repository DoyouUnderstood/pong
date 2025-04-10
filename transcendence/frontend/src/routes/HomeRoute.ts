import { RouteI } from "../interfaces/RouteInterface.js";
import { User } from "../models/User.js";
import { AuthService } from "../services/authService.js";
import { eventBus } from "../utils/EventBus.js";
export class HomeRoute implements RouteI
{
    partial = 'home.html';
    authentification: "loginRequired" = "loginRequired";
    async setup(container: HTMLElement): Promise <void>
    {
        const user = AuthService.getCurrentUser();
        if (user)
            this.welcomeMsg(container, user.username);
    }

    private welcomeMsg(container: HTMLElement, username: string)
    {
        const message = container.querySelector("#welcome-msg") as HTMLElement;
        if (message)
            message.textContent = username;
    }
}
