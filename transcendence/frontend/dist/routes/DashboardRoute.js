import { AuthService } from "../services/authService.js";
export class DashboardRoute {
    constructor() {
        this.partial = "dashboard.html";
        this.authentification = "loginRequired";
    }
    async setup(container) {
        const logoutBtn = container.querySelector("#logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                AuthService.logout();
            });
        }
    }
}
