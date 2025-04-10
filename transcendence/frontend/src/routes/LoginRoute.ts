import { RouteI } from "../interfaces/RouteInterface.js";
import { eventBus } from "../utils/EventBus.js";
import { AuthService } from "../services/authService.js";
import { User } from "../models/User.js";

export class LoginRoute implements RouteI
{
    partial = "login.html";
    authentification: "loginNotRequired" = "loginNotRequired";

    async setup(container: HTMLElement): Promise<void> {
        console.log("Page login affichée");
        this.eventlogin(container);
        this.loginErrorListener(container);
    }
    
    private loginErrorListener(container: HTMLElement)
    {
        eventBus.register("error:login", (message: string) => {
            console.log(message);
            const errorDiv = container.querySelector("#error-msg") as HTMLElement;
            if (errorDiv)
                errorDiv.textContent = message;
        })
    }
    
    eventlogin(container: HTMLElement) {
        const form = container.querySelector("form");
        if (!form) {
            console.error("form login erreur!");
            return;
        }
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const usernameInput = form.querySelector('input[name="uname"]') as HTMLInputElement;
            const passwordInput = form.querySelector('input[name="psw"]') as HTMLInputElement;

 
            ///ATTENTION BESOIN DE MIEUX GERER ICI
            // ATTENTION BESOIN DE MIEUX GERER ICI 
            // ATTENTION BESOIN DE MIEUX GERER ICI
            
            if (!usernameInput || !passwordInput) {
                console.error("Champs de formulaire manquants !");
                return;
            }
            const username = usernameInput.value;
            const password = passwordInput.value;

            const user = new User(username, password);
            AuthService.login(user);
        })
    }
}

