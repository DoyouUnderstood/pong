import { eventBus } from "../utils/EventBus.js";
import { router} from "../services/routeurService.js";
import { User } from "../models/User.js";
import { Api } from "../services/api.js";
import { AppError } from "../utils/Errors.js";

export class authService
{
    #isAuthenticated = false;
    #currentUser: User | null = null;

    async init() {
    try {
        const response = await Api.get("me");
        this.#isAuthenticated = true;
        this.#storeUser(response.user);
        console.log("Session restored:", response.user);
        } catch (err) {
            this.#isAuthenticated = false;
            this.#currentUser = null;
        }
    }
    // ceci n'a rien a faire ici
    /*
    async get_qr_code()
    {
            const response = await Api.get("qr-code");
            console.log("salutpetit.c'est le qr code fonction.", response.src);       
            return response.src;
    }
    */

    async logout() {
            const response = await Api.post("logout");
            console.log(response.message);
            this.#isAuthenticated = false;
            this.#currentUser = null;
            await router.naviguate("login");
    }
    async login(user: User) 
    {
        try {
            const response = await Api.post("login", user);
            if (response.twoFARequired == true)
                this.handle2FA();
            this.#isAuthenticated = true;
            this.#storeUser(response.user);
            await router.naviguate("dashboard");
        }
        catch (error)
        {
            if (error instanceof AppError)
                eventBus.dispatch("error:login", error.message);
        }
    }
    private handle2FA()
    {
        
    }
    async signup(user: User)
    {
        try {
            console.log(user);
            const response = await Api.post("signup", user);
            this.#storeUser(response.user);
            router.naviguate("login");
        } catch (error) {
            if (error instanceof AppError)
                eventBus.dispatch("error:signup", error.message);
        }
    }

    async updateUser(user: User)
    {
        try {
            const response = await Api.post("update", user);
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
        token: userData.token, 
        twoFAEnabled: userData.twoFAEnabled,
        twoFAMethod: userData.twoFAMethod,
    };
}

}

export const AuthService = new authService();
