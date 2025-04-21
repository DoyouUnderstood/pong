import { eventBus } from "../utils/EventBus.js";
import { AuthService } from "../services/authService.js";
import { User } from "../models/User.js";
export class LoginRoute {
    constructor() {
        this.partial = "login.html";
        this.authentification = "loginNotRequired";
    }
    async setup(container) {
        this.eventlogin(container);
        this.loginErrorListener(container);
    }
    loginErrorListener(container) {
        eventBus.register("error:login", (message) => {
            const errorDiv = container.querySelector("#error-msg");
            if (errorDiv)
                errorDiv.textContent = message;
        });
    }
    eventlogin(container) {
        const form = container.querySelector("form");
        if (!form) {
            console.error("form login erreur!");
            return;
        }
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const usernameInput = form.querySelector('input[name="uname"]');
            const passwordInput = form.querySelector('input[name="psw"]');
            if (!usernameInput || !passwordInput) {
                eventBus.dispatch("error:login", "Tous les champs sont obligatoires.");
                return;
            }
            const username = usernameInput.value;
            const password = passwordInput.value;
            const user = new User(username, password);
            AuthService.login(user);
        });
    }
}
