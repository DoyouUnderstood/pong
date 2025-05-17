
import { User } from "../models/User.js";
import { RouteI } from "../interfaces/RouteInterface.js";
import { addBackButtonListener } from "../utils/EventBus.js";
import { AuthService } from "../services/authService.js";
import { Api } from "../services/api.js";
import { router } from "../services/routeurService.js";
import { twoFAService } from '../services/twoFAService.js';
export class SettingsRoute implements RouteI {
    partial = "settings.html";
    authentification: "loginRequired" = "loginRequired";

    async setup(container: HTMLElement): Promise<void> {
        this.formEvent(container);
        this.enable2fa(container);
    }

    private async enable2fa(container: HTMLElement) {
    const toggle = container.querySelector('input[type="checkbox"].peer') as HTMLInputElement | null;
    if (!toggle) return;

    // Toujours afficher la vraie valeur backend
    await this.refreshToggleState(toggle);

    toggle.addEventListener("change", async () => {
        const visible = toggle.checked;

        if (visible) {
            // On NE coche pas ici !! On navigue
            router.naviguate('select-2fa-method');
        } else {
            // Pareil : vérifier serveur
            const status = await twoFAService.getStatus();
            if (status.twoFAMethod === "email") {
                router.naviguate('disable-2fa-email');
            } else if (status.twoFAMethod === "qr-code") {
                return ;
                //router.naviguate('disable-2fa-qrcode');
            } else {
                console.error("Méthode 2FA inconnue.");
            }
        }
    });
}

private async refreshToggleState(toggle: HTMLInputElement) {
    const response = await twoFAService.getStatus();
    toggle.checked = response.twoFAEnabled; // toggle est mis à jour en fonction du serveur
}

    private formEvent(container: HTMLElement) {
        const form = container.querySelector("form");
        if (!form) 
            return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const usernameInput = form.querySelector('input[name="username"]') as HTMLInputElement;
            const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;
            const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;

            const username = usernameInput.value;
            const password = passwordInput.value;
            const email = emailInput.value;
            const id = AuthService.getCurrentId();

            if (!id)
                return ;
            const user = new User(username, password, email, id);
            AuthService.updateUser(user);
        });
    }
}

