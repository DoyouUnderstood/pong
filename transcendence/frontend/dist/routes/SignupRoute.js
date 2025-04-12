import { User } from "../models/User.js";
import { AuthService } from "../services/authService.js";
import { eventBus } from "../utils/EventBus.js";
export class SignupRoute {
    constructor() {
        this.partial = "signup.html";
        this.authentification = "loginNotRequired";
    }
    async setup(container) {
        console.log("bienvenue dans signup!");
        this.eventSubmit(container);
        this.registerErrorListener(container);
    }
    registerErrorListener(container) {
        eventBus.register("error:signup", (message) => {
            const errorDiv = container.querySelector("#error-msg");
            if (errorDiv)
                errorDiv.textContent = message;
        });
    }
    eventSubmit(container) {
        const form = container.querySelector("form");
        if (!form) {
            console.log("erreur dans le formulaire");
            return;
        }
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const usernameInput = form.querySelector('input[name="username"]');
            const passwordInput = form.querySelector('input[name="password"]');
            const emailInput = form.querySelector('input[name="email"]');
            if (!usernameInput || !passwordInput || !emailInput) {
                console.error("Champs de formulaire manquants !");
                return;
            }
            const username = usernameInput.value;
            const password = passwordInput.value;
            const email = emailInput.value;
            const user = new User(username, password, email);
            console.log("fin de eventl");
            AuthService.signup(user);
        });
    }
}
