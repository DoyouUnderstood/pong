import { eventBus } from "../utils/EventBus.js";
import { router} from "../services/routeurService.js";
import { User } from "../models/User.js";
import { Api } from "../services/api.js";
import { AppError } from "../utils/Errors.js";

export class authService
{
    #isAuthenticated = false;
    #currentUser: User | null = null;
    async login(user: User) 
    {
        try {
            const response = await Api.post("login", user);
            this.#isAuthenticated = true;
            console.log("user's login " + user.username, response);
            this.#currentUser = user; 
            await router.naviguate("home");
        }
        catch (error)
        {
            if (error instanceof AppError)
                eventBus.dispatch("error:login", error.message);
        }
    }

    async signup(user: User)
    {
        try {
            await Api.post("signup", user);
            router.naviguate("login");
        } catch (error) {
            if (error instanceof AppError)
                eventBus.dispatch("error:signup", error.message);
        }
    }

    async updateUser(user: User)
    {
        try {
            await Api.post("update", user);
            eventBus.dispatch("update:user", "settings correctly updated.");
        } catch (error)
        {
            if (error instanceof AppError)
                eventBus.dispatch("update:user", error.message);
        }

    }
    getCurrentUser(): User | null {
        return this.#currentUser;
    }
    islogin(): boolean {
        return this.#isAuthenticated;
    }
}

export const AuthService = new authService();
