import { eventBus } from "../utils/EventBus.js";
import { router} from "../services/routeurService.js";
import { User } from "../models/User.js";
export class authService
{
    #isAuthenticated = false;

    login(user: User) {
        this.#isAuthenticated = true;
        console.log("bienvenue " + user.username);
        router.naviguate("home");
    }

    islogin(): boolean {
        return this.#isAuthenticated;
    }
}

export const AuthService = new authService();
