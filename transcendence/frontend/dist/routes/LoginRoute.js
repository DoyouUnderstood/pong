import { AuthService } from "../services/authService.js";
import { User } from "../models/User.js";
export class LoginRoute {
    constructor() {
        this.partial = "login.html";
        this.authentification = "loginNotRequired";
    }
    async setup(container) {
        console.log("Page login affichée");
        this.eventlogin(container);
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
                console.error("Champs de formulaire manquants !");
                return;
            }
            const username = usernameInput.value;
            const password = passwordInput.value;
            const user = new User(username, password);
            AuthService.login(user);
        });
    }
}
