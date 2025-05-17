import { RouteI } from "../interfaces/RouteInterface.js";
import { User } from "../models/User.js";
import { AuthService } from "../services/authService.js";
import { eventBus } from "../utils/EventBus.js";
import { isValidEmail } from "../utils/Errors.js";
import { setupAvatarSelector } from "../utils/avatarSelector.js";

export class SignupRoute implements RouteI
{
    partial = "signup.html";
    authentification: "loginNotRequired" = "loginNotRequired";
    async setup (container: HTMLElement): Promise <void>
    {
        this.registerErrorListener(container);
        this.eventSubmit(container);
        setupAvatarSelector(container);
    }   
    
    private registerErrorListener(container: HTMLElement) 
    {
        eventBus.register("error:signup", (message: string) => {
        const errorDiv = container.querySelector("#error-msg") as HTMLElement;
            if (errorDiv)
                errorDiv.textContent = message;
        });
    }
    eventSubmit(container: HTMLElement) {
    const form = container.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const usernameInput = form.querySelector('input[name="username"]') as HTMLInputElement;
        const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;
        const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
        const avatarInput = form.querySelector('input[name="selectedAvatar"]') as HTMLInputElement;

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
