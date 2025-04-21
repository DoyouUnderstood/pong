import { User } from "../models/User.js";
import { RouteI } from "../interfaces/RouteInterface.js";
import { eventBus } from "../utils/EventBus.js";
import { authService, AuthService } from "../services/authService.js";

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
        const button = container.getElementsByClassName("SMS")[0] as HTMLElement;
        if (!button)
            return;
        button.addEventListener("click" , (err: MouseEvent) => {
            err.preventDefault();
            AuthService.send_sms_code();
        });
        const form = container.querySelector("form");
        if (!form)
            return ;
        form.addEventListener("submit", (e) => {
                e.preventDefault();
                const usernameInput = form.querySelector('input[name="username"]') as HTMLInputElement;
                const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;
                const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;

                const username = usernameInput.value;
                const password = passwordInput.value;
                const email = emailInput.value;
                const id = AuthService.getCurrentId();
                if (!id)
                    return;
                const user = new User(username, password, email, id);
                AuthService.updateUser(user);
        });
    }
}
