import { RouteI } from "../interfaces/RouteInterface.js";
import { loadService } from "../services/loadService.js";

import { AuthService } from "./authService.js"; // needed for route guards

export class RouterService {
	#routes = new Map<string, RouteI>();
	#container: HTMLElement | null = null;
	#currentRoute: RouteI | null = null;
	#currentPath: string | null = null;

	setup(container: HTMLElement) {
		this.#container = container;
	}

	async start() 
	{
		await AuthService.init();
		document.addEventListener("click", (e) => {
		const target = e.target as HTMLElement;
		if (target.tagName === "A") {
			const href = (target as HTMLAnchorElement).getAttribute("href");
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
	
	addRoute(path: string, route: RouteI) {
		this.#routes.set(path, route);
	}

    async naviguate(path: string, fromPopState = false): Promise<void> {

        if (path === this.#currentPath && !fromPopState)
            return;

    const route = this.#routes.get(path);

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

    // 🔥 Toujours pousser dans l'historique SI ce n'est pas une navigation du bouton back/forward
    if (!fromPopState) {
        window.history.pushState(null, "", `/${path}`);
    }

    const html = await loadService(route.partial);
    this.#currentRoute?.cleanup?.();
    if (this.#container) {
        this.#container.innerHTML = html;
        await route.setup(this.#container);
    }

    this.#currentRoute = route;
    this.#currentPath = path;
}

}

export const router = new RouterService();
