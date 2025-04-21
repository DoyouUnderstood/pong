import { RouterService } from "../services/routeurService";
import { RouteI } from "../interfaces/RouteInterface";
import { AuthService } from "../services/authService.js";
export class DashboardRoute implements RouteI
{
    partial = "dashboard.html";
    authentification: "loginRequired" = "loginRequired";

    async setup(container: HTMLElement): Promise <void>
    {
        const logoutBtn = container.querySelector("#logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                AuthService.logout();
            });
        }       
    }
}
