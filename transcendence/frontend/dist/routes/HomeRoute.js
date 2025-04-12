import { AuthService } from "../services/authService.js";
export class HomeRoute {
    constructor() {
        this.partial = 'home.html';
        this.authentification = "loginRequired";
    }
    async setup(container) {
        const user = AuthService.getCurrentUser();
        if (user)
            this.welcomeMsg(container, user.username);
    }
    welcomeMsg(container, username) {
        const message = container.querySelector("#welcome-msg");
        if (message)
            message.textContent = username;
    }
}
