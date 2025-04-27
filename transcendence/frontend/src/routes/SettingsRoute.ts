import { User } from "../models/User.js";
import { RouteI } from "../interfaces/RouteInterface.js";
import { eventBus } from "../utils/EventBus.js";
import { AuthService } from "../services/authService.js";
import { Api } from "../services/api.js";
import { router } from "../services/routeurService.js";
export class SettingsRoute implements RouteI {
    partial = "settings.html";
    authentification: "loginRequired" = "loginRequired";

    async setup(container: HTMLElement): Promise<void> {
        this.formEvent(container);
        this.eventUpdate(container);
        this.enable2fa(container);
    }

    private enable2fa(container: HTMLElement) {
    const toggle = container.querySelector('input[type="checkbox"].peer') as HTMLInputElement | null;
    const qrcodeBtn = container.querySelector("#button-qrcode") as HTMLButtonElement | null;
    const emailBtn = container.querySelector("#button-email") as HTMLButtonElement | null;
    const img = container.querySelector("#DisplayQr-code") as HTMLImageElement | null;

    if (!toggle || !qrcodeBtn || !emailBtn || !img) return;

    toggle.addEventListener("change", () => {
        const visible = toggle.checked;
        this.toggle2faOptions(visible, qrcodeBtn, emailBtn);

        if (visible) {
           router.naviguate('doubleauth');
            //this.register2faHandlers(container, qrcodeBtn, emailBtn);
        } else {
            // 👇 cache aussi le QR code
            img.classList.add("invisible");
        }
    });
}

    private toggle2faOptions(visible: boolean, qr: HTMLElement, email: HTMLElement) {
        const method = visible ? "remove" : "add";
        qr.classList[method]("opacity-0", "pointer-events-none");
        email.classList[method]("opacity-0", "pointer-events-none");
    }

    private register2faHandlers(container: HTMLElement, qr: HTMLButtonElement, email: HTMLButtonElement) {
        qr.onclick = () => this.handleQrCode(container);
        email.onclick = () => this.handleEmailCode();
    }

    private async handleQrCode(container: HTMLElement) {
        try {
               const response = await fetch("/api/qr-code", {
            method: "GET",
            credentials: "include",
        });
            console.log("proute", response);
            const blob = await response.blob();
            const img = container.querySelector("#DisplayQr-code") as HTMLImageElement;
            if (img) {
                console.log("je rentre ici! voici img:", img);
                img.src = URL.createObjectURL(blob);
                img.classList.remove("invisible");

            }
        } catch (error) {
            console.error("Erreur lors de la récupération du QR code:", error);
        }
    }

    private handleEmailCode() {
        alert("Email 2FA not yet implemented.");
    }

    private eventUpdate(container: HTMLElement) {
        eventBus.register("update:user", (message: string) => {
            console.log("salutmonpotteee");
            const msgDiv = container.querySelector("#update-msg") as HTMLElement;
            if (msgDiv) msgDiv.textContent = message;
        });
    }

    private formEvent(container: HTMLElement) {
        const form = container.querySelector("form");
        if (!form) return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const usernameInput = form.querySelector('input[name="username"]') as HTMLInputElement;
            const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;
            const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;

            const username = usernameInput.value;
            const password = passwordInput.value;
            const email = emailInput.value;
            const id = AuthService.getCurrentId();

            if (!id) return;

            const user = new User(username, password, email, id);
            AuthService.updateUser(user);
        });
    }
}

