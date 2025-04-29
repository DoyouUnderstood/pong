import { User } from "../models/User.js";
import { RouteI } from "../interfaces/RouteInterface.js";
import { eventBus } from "../utils/EventBus.js";
import { AuthService } from "../services/authService.js";
import { Api } from "../services/api.js";
import { router } from "../services/routeurService.js";

export class SettingsRoute implements RouteI {
    partial = "settings.html";
    authentification: "loginRequired" = "loginRequired";

    async setup(container: HTMLElement): Promise<void> {
        this.formEvent(container);
        this.enable2fa(container);
    }
    private async disable2fa(container: HTMLElement)
    {
        const twoFAStatus = await Api.get('2fa/status');
        if (twoFAStatus.twoFAEnabled == true && twoFAStatus.twoFAMethod == "email")
        {
            return ;
        } else if (twoFAStatus.twoFAEnabled == true && twoFAStatus.twoFAMethod == "qr-code")
        {
            return ;
        }

    }
    private async enable2fa(container: HTMLElement) {
        const toggle = container.querySelector('input[type="checkbox"].peer') as HTMLInputElement | null;

        if (!toggle) 
            return;
    
        const response = await Api.get("2fa/status");
        let isactivate: Boolean = response.twoFAEnabled;
        if (isactivate == true)
        {
            console.log("checked");
            toggle.checked = true;
        }
        toggle.addEventListener("change", () => {
            const visible = toggle.checked;
            if (visible)
                router.naviguate('select-2fa-method');
      //      else 
        //        this.disable2fa(container: HTMLElement);
        });
    }

    private formEvent(container: HTMLElement) {
        const form = container.querySelector("form");
        if (!form) 
            return;

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
                return ;
            const user = new User(username, password, email, id);
            AuthService.updateUser(user);
        });
    }
}

