var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _authService_instances, _authService_isAuthenticated, _authService_currentUser, _authService_storeUser;
import { eventBus } from "../utils/EventBus.js";
import { router } from "../services/routeurService.js";
import { Api } from "../services/api.js";
import { AppError } from "../utils/Errors.js";
export class authService {
    constructor() {
        _authService_instances.add(this);
        _authService_isAuthenticated.set(this, false);
        _authService_currentUser.set(this, null);
    }
    async login(user) {
        try {
            const response = await Api.post("login", user);
            __classPrivateFieldSet(this, _authService_isAuthenticated, true, "f");
            __classPrivateFieldGet(this, _authService_instances, "m", _authService_storeUser).call(this, response.user);
            await router.naviguate("home");
        }
        catch (error) {
            if (error instanceof AppError)
                eventBus.dispatch("error:login", error.message);
        }
    }
    async signup(user) {
        try {
            const response = await Api.post("signup", user);
            __classPrivateFieldGet(this, _authService_instances, "m", _authService_storeUser).call(this, response.user);
            console.log("voici l'id de la reponse et celui cense etre stocke: ", response.user.id, this.getCurrentId());
            router.naviguate("login");
        }
        catch (error) {
            if (error instanceof AppError)
                eventBus.dispatch("error:signup", error.message);
        }
    }
    async updateUser(user) {
        try {
            console.log("user envoyé pour update :", user);
            const response = await Api.post("update", user);
            console.log("response apres changement: ", response.user.username);
            __classPrivateFieldGet(this, _authService_instances, "m", _authService_storeUser).call(this, response.user);
            eventBus.dispatch("update:user", "settings correctly updated.");
        }
        catch (error) {
            if (error instanceof AppError)
                eventBus.dispatch("update:user", error.message);
        }
    }
    getCurrentUser() {
        return __classPrivateFieldGet(this, _authService_currentUser, "f");
    }
    getCurrentId() {
        if (__classPrivateFieldGet(this, _authService_currentUser, "f")?.id)
            return __classPrivateFieldGet(this, _authService_currentUser, "f").id;
        return null;
    }
    islogin() {
        return __classPrivateFieldGet(this, _authService_isAuthenticated, "f");
    }
}
_authService_isAuthenticated = new WeakMap(), _authService_currentUser = new WeakMap(), _authService_instances = new WeakSet(), _authService_storeUser = function _authService_storeUser(userData) {
    __classPrivateFieldSet(this, _authService_currentUser, {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        password: "", // jamais stocker le vrai password en front
    }, "f");
};
export const AuthService = new authService();
