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
var _RouterService_route, _RouterService_container, _RouterService_currentRoute;
import { loadService } from "../services/loadService.js";
export class RouterService {
    constructor() {
        _RouterService_route.set(this, new Map());
        _RouterService_container.set(this, null);
        _RouterService_currentRoute.set(this, null);
    }
    setup(container) {
        __classPrivateFieldSet(this, _RouterService_container, container, "f");
    }
    async addRoute(path, route) {
        __classPrivateFieldGet(this, _RouterService_route, "f").set(path, route);
    }
    async naviguate(path) {
        const route = __classPrivateFieldGet(this, _RouterService_route, "f").get(path);
        if (!route)
            return;
        window.history.pushState(null, "", path);
        const html = await loadService(route.partial);
        __classPrivateFieldGet(this, _RouterService_currentRoute, "f")?.cleanup?.();
        if (__classPrivateFieldGet(this, _RouterService_container, "f")) {
            __classPrivateFieldGet(this, _RouterService_container, "f").innerHTML = html;
            await route.setup(__classPrivateFieldGet(this, _RouterService_container, "f"));
        }
        __classPrivateFieldSet(this, _RouterService_currentRoute, route, "f");
    }
}
_RouterService_route = new WeakMap(), _RouterService_container = new WeakMap(), _RouterService_currentRoute = new WeakMap();
export const router = new RouterService();
