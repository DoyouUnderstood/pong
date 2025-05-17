import { User } from "../models/User.js";
import { AuthService } from "../services/authService.js";
import { eventBus } from "../utils/EventBus.js";
import { isValidEmail } from "../utils/Errors.js";
import { setupAvatarSelector } from "../utils/avatarSelector.js";
export class SignupRoute {
    constructor() {
        this.partial = "signup.html";
        this.authentification = "loginNotRequired";
    }
    async setup(container) {
        this.registerErrorListener(container);
        this.eventSubmit(container);
        setupAvatarSelector(container);
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
        if (!form)
            return;
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const usernameInput = form.querySelector('input[name="username"]');
            const passwordInput = form.querySelector('input[name="password"]');
            const emailInput = form.querySelector('input[name="email"]');
            const avatarInput = form.querySelector('input[name="selectedAvatar"]');
            if (!usernameInput || !passwordInput || !emailInput || !isValidEmail(emailInput.value)) {
                eventBus.dispatch("error:signup", "Erreur dans le formulaire.");
                return;
            }
            const username = usernameInput.value;
            const password = passwordInput.value;
            const email = emailInput.value;
            const avatar = avatarInput?.value;
            const user = new User(username, password, email, avatar);
            AuthService.signup(user);
        });
    }
}
