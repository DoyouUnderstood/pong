import { RouteI } from "../interfaces/RouteInterface.js";
import { User } from "../models/User.js";
import { AuthService } from "../services/authService.js";

export class SignupRoute implements RouteI
{
    partial = "signup.html";
    authentification: "loginNotRequired" = "loginNotRequired";
    async setup (container: HTMLElement): Promise <void>
    {
        console.log("bienvenue dans signup!");
        this.eventSubmit(container);
    }
    eventSubmit(container: HTMLElement)
    {
        const form = container.querySelector("form");
        if (!form)
        {
            console.log("erreur dans le formulaire");
            return ; 
        }
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const usernameInput = form.querySelector('input[name="username"]') as HTMLInputElement;
            const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;
            const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;

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


        })
    }
}
