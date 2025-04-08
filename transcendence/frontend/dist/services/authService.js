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
var _authService_isAuthenticated;
import { router } from "../services/routeurService.js";
export class authService {
    constructor() {
        _authService_isAuthenticated.set(this, false);
    }
    login(user) {
        __classPrivateFieldSet(this, _authService_isAuthenticated, true, "f");
        console.log("bienvenue " + user.username);
        router.naviguate("home");
    }
    islogin() {
        return __classPrivateFieldGet(this, _authService_isAuthenticated, "f");
    }
}
_authService_isAuthenticated = new WeakMap();
export const AuthService = new authService();
