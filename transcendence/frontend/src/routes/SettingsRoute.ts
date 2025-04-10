import { User } from "../models/User.js";
import { RouteI } from "../interfaces/RouteInterface.js";
import { eventBus } from "../utils/EventBus.js";
import { AuthService } from "../services/authService.js";

export class SettingsRoute implements RouteI{
    partial = "settings.html";
    authentification: "loginRequired" = "loginRequired";

    async setup(container: HTMLElement): Promise<void>
    {
        this.formEvent(container);
        this.eventUpdate(container);
    }

    private eventUpdate(container: HTMLElement)
    {
        eventBus.register("update:user", (message: string) => {
            const msg_div = container.querySelector("#update-msg") as HTMLElement;
            if (msg_div)
                msg_div.textContent = message; 
        })
    }

    formEvent(container: HTMLElement)
    {
        const form = container.querySelector("form");
        if (!form)
        {
            console.log("erreur dans le formulaire.");
            return ;
        }
        form.addEventListener("submit", (e) => {
                e.preventDefault();
                const usernameInput = form.querySelector('input[name="username"]') as HTMLInputElement;
                const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;
                const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;

                const username = usernameInput.value;
                const password = passwordInput.value;
                const email = emailInput.value;
                const user = new User(username, password, email);
                AuthService.updateUser(user);
        });
    }
}
