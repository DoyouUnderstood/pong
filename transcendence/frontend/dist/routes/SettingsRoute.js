import { User } from "../models/User.js";
import { AuthService } from "../services/authService.js";
import { Api } from "../services/api.js";
import { router } from "../services/routeurService.js";
export class SettingsRoute {
    constructor() {
        this.partial = "settings.html";
        this.authentification = "loginRequired";
    }
    async setup(container) {
        this.formEvent(container);
        this.enable2fa(container);
    }
    async disable2fa(container) {
        const twoFAStatus = await Api.get('2fa/status');
        if (twoFAStatus.twoFAEnabled == true && twoFAStatus.twoFAMethod == "email") {
            return;
        }
        else if (twoFAStatus.twoFAEnabled == true && twoFAStatus.twoFAMethod == "qr-code") {
            return;
        }
    }
    async enable2fa(container) {
        const toggle = container.querySelector('input[type="checkbox"].peer');
        if (!toggle)
            return;
        const response = await Api.get("2fa/status");
        let isactivate = response.twoFAEnabled;
        if (isactivate == true) {
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
    formEvent(container) {
        const form = container.querySelector("form");
        if (!form)
            return;
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const usernameInput = form.querySelector('input[name="username"]');
            const passwordInput = form.querySelector('input[name="password"]');
            const emailInput = form.querySelector('input[name="email"]');
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
