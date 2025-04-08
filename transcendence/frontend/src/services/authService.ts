import { eventBus } from "../utils/EventBus.js";
import { router} from "../services/routeurService.js";
import { User } from "../models/User.js";
import { Api } from "../services/api.js";

export class authService
{
    #isAuthenticated = false;

    async login(user: User) {
        
        const response = await Api.post("login", user);
        this.#isAuthenticated = true;
        console.log("user's login " + user.username, response);
        await router.naviguate("home");
    }

    async signup(user: User)
    {
        await Api.post("signup", user);
        console.log("user is signup", user.username);
        await router.naviguate("login");
    }
    islogin(): boolean {
        return this.#isAuthenticated;
    }
}

export const AuthService = new authService();
