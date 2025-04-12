import { User } from "../models/User.js";
import { eventBus } from "../utils/EventBus.js";
import { AuthService } from "../services/authService.js";
export class SettingsRoute {
    constructor() {
        this.partial = "settings.html";
        this.authentification = "loginRequired";
    }
    async setup(container) {
        this.formEvent(container);
        this.eventUpdate(container);
    }
    eventUpdate(container) {
        eventBus.register("update:user", (message) => {
            const msg_div = container.querySelector("#update-msg");
            if (msg_div)
                msg_div.textContent = message;
        });
    }
    formEvent(container) {
        const form = container.querySelector("form");
        if (!form) {
            console.log("erreur dans le formulaire.");
            return;
        }
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
