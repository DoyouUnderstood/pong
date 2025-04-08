import { RouteI } from "../interfaces/RouteInterface.js";
import { loadService } from "../services/loadService.js";
export class RouterService {
    
    #route = new Map<string, RouteI>();
    #container: HTMLElement | null = null; 
    #currentRoute: RouteI | null = null; 

    setup(container: HTMLElement)
    {
        this.#container = container;
    }

    async addRoute(path: string, route: RouteI)
    {
        this.#route.set(path, route);
    }

    async naviguate(path: string) {
        const route = this.#route.get(path);
        if (!route)
            return; 
        //verifier que la route est en @@
        window.history.pushState(null, "", path);
        const html = await loadService(route.partial);
        this.#currentRoute?.cleanup?.();
        if (this.#container)
        {
            this.#container.innerHTML = html;
            await route.setup(this.#container);
        }
        this.#currentRoute = route;
    }
}

export const router = new RouterService();
