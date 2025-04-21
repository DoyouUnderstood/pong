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
    // Ne fais pas de naviguate ici ! C'est le rôle de app.ts
        }
    }
    async send_sms_code()
    {
            const data = {message: "ceci est le message de la fonction send_sms_code", to: "+33668788341"};
            const response = await Api.post("send-sms", data);
            console.log("salutpetit.c'est la sms fonction.");
            console.log(response);
            eventBus.dispatch("update-user", "le sms est envoye !");
    }
    async logout() {
        try {
            const response = await Api.post("logout");
            console.log(response.message);
        } catch (err) {
            console.warn("Failed to notify backend:", err);
        }
            this.#isAuthenticated = false;
            this.#currentUser = null;
            await router.naviguate("login");
    }
    async login(user: User) 
    {
        try {
            const response = await Api.post("login", user);
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

    async signup(user: User)
    {
        try {
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
    };
}

}

export const AuthService = new authService();
