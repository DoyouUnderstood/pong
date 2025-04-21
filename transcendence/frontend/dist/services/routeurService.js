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
var _RouterService_routes, _RouterService_container, _RouterService_currentRoute, _RouterService_currentPath;
import { loadService } from "../services/loadService.js";
import { AuthService } from "./authService.js"; // needed for route guards
export class RouterService {
    constructor() {
        _RouterService_routes.set(this, new Map());
        _RouterService_container.set(this, null);
        _RouterService_currentRoute.set(this, null);
        _RouterService_currentPath.set(this, null);
    }
    setup(container) {
        __classPrivateFieldSet(this, _RouterService_container, container, "f");
    }
    async start() {
        await AuthService.init();
        document.addEventListener("click", (e) => {
            const target = e.target;
            if (target.tagName === "A") {
                const href = target.getAttribute("href");
                if (href?.startsWith("/")) {
                    e.preventDefault();
                    this.naviguate(href.slice(1));
                }
            }
        });
        window.addEventListener("popstate", () => {
            const path = window.location.pathname.slice(1);
            this.naviguate(path, true);
        });
        const path = window.location.pathname.slice(1) || "login";
        this.naviguate(path);
    }
    addRoute(path, route) {
        __classPrivateFieldGet(this, _RouterService_routes, "f").set(path, route);
    }
    async naviguate(path, fromPopState = false) {
        if (path === __classPrivateFieldGet(this, _RouterService_currentPath, "f"))
            return;
        const route = __classPrivateFieldGet(this, _RouterService_routes, "f").get(path);
        if (!route) {
            console.warn(`Route not found: ${path}`);
            return this.naviguate("login");
        }
        if (route.authentification === "loginRequired" && !AuthService.islogin()) {
            return this.naviguate("login");
        }
        if (route.authentification === "loginNotRequired" && AuthService.islogin()) {
            return this.naviguate("home");
        }
        if (!fromPopState) {
            window.history.pushState(null, "", `/${path}`);
        }
        const html = await loadService(route.partial);
        __classPrivateFieldGet(this, _RouterService_currentRoute, "f")?.cleanup?.();
        if (__classPrivateFieldGet(this, _RouterService_container, "f")) {
            __classPrivateFieldGet(this, _RouterService_container, "f").innerHTML = html;
            await route.setup(__classPrivateFieldGet(this, _RouterService_container, "f"));
        }
        __classPrivateFieldSet(this, _RouterService_currentRoute, route, "f");
        __classPrivateFieldSet(this, _RouterService_currentPath, path, "f");
    }
}
_RouterService_routes = new WeakMap(), _RouterService_container = new WeakMap(), _RouterService_currentRoute = new WeakMap(), _RouterService_currentPath = new WeakMap();
export const router = new RouterService();
