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
            this.#storeUser(response.user);
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
            const response = await Api.post("signup", user);
            this.#storeUser(response.user);
            console.log("voici l'id de la reponse et celui cense etre stocke: ", response.user.id, this.getCurrentId());
            router.naviguate("login");
        } catch (error) {
            if (error instanceof AppError)
                eventBus.dispatch("error:signup", error.message);
        }
    }

    async updateUser(user: User)
    {
        try {
            console.log("user envoyé pour update :", user);
            const response = await Api.post("update", user);
            console.log("response apres changement: ",response.user.username);
            this.#storeUser(response.user);
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
    getCurrentId(): number | null
    {
        if (this.#currentUser?.id)
            return this.#currentUser.id;
        return null;
    }
    islogin(): boolean {
        return this.#isAuthenticated;
    }
    #storeUser(userData: User) {
    this.#currentUser = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        password: "",  // jamais stocker le vrai password en front
    };
}

}

export const AuthService = new authService();
