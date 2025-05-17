import { User } from "../models/User.js";
import { AuthService } from "../services/authService.js";
import { router } from "../services/routeurService.js";
import { twoFAService } from '../services/twoFAService.js';
export class SettingsRoute {
    constructor() {
        this.partial = "settings.html";
        this.authentification = "loginRequired";
    }
    async setup(container) {
        this.formEvent(container);
        this.enable2fa(container);
    }
    async enable2fa(container) {
        const toggle = container.querySelector('input[type="checkbox"].peer');
        if (!toggle)
            return;
        // Toujours afficher la vraie valeur backend
        await this.refreshToggleState(toggle);
        toggle.addEventListener("change", async () => {
            const visible = toggle.checked;
            if (visible) {
                // On NE coche pas ici !! On navigue
                router.naviguate('select-2fa-method');
            }
            else {
                // Pareil : vérifier serveur
                const status = await twoFAService.getStatus();
                if (status.twoFAMethod === "email") {
                    router.naviguate('disable-2fa-email');
                }
                else if (status.twoFAMethod === "qr-code") {
                    return;
                    //router.naviguate('disable-2fa-qrcode');
                }
                else {
                    console.error("Méthode 2FA inconnue.");
                }
            }
        });
    }
    async refreshToggleState(toggle) {
        const response = await twoFAService.getStatus();
        toggle.checked = response.twoFAEnabled; // toggle est mis à jour en fonction du serveur
    }
    formEvent(container) {
        const form = container.querySelector("form");
        if (!form)
            return;
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const usernameInput = form.querySelector('input[name="username"]');
            const passwordInput = form.querySelector('input[name="password"]');
            const emailInput = form.querySelector('input[name="email"]');
            const username = usernameInput.value;
            const password = passwordInput.value;
            const email = emailInput.value;
            const id = AuthService.getCurrentId();
            if (!id)
                return;
            const user = new User(username, password, email, id);
            AuthService.updateUser(user);
        });
    }
}
