import { User } from "../models/User.js";
import { eventBus } from "../utils/EventBus.js";
import { AuthService } from "../services/authService.js";
import { router } from "../services/routeurService.js";
export class SettingsRoute {
    constructor() {
        this.partial = "settings.html";
        this.authentification = "loginRequired";
    }
    async setup(container) {
        this.formEvent(container);
        this.eventUpdate(container);
        this.enable2fa(container);
    }
    enable2fa(container) {
        const toggle = container.querySelector('input[type="checkbox"].peer');
        const qrcodeBtn = container.querySelector("#button-qrcode");
        const emailBtn = container.querySelector("#button-email");
        const img = container.querySelector("#DisplayQr-code");
        if (!toggle || !qrcodeBtn || !emailBtn || !img)
            return;
        toggle.addEventListener("change", () => {
            const visible = toggle.checked;
            this.toggle2faOptions(visible, qrcodeBtn, emailBtn);
            if (visible) {
                router.naviguate('doubleauth');
                //this.register2faHandlers(container, qrcodeBtn, emailBtn);
            }
            else {
                // 👇 cache aussi le QR code
                img.classList.add("invisible");
            }
        });
    }
    toggle2faOptions(visible, qr, email) {
        const method = visible ? "remove" : "add";
        qr.classList[method]("opacity-0", "pointer-events-none");
        email.classList[method]("opacity-0", "pointer-events-none");
    }
    register2faHandlers(container, qr, email) {
        qr.onclick = () => this.handleQrCode(container);
        email.onclick = () => this.handleEmailCode();
    }
    async handleQrCode(container) {
        try {
            const response = await fetch("/api/qr-code", {
                method: "GET",
                credentials: "include",
            });
            console.log("proute", response);
            const blob = await response.blob();
            const img = container.querySelector("#DisplayQr-code");
            if (img) {
                console.log("je rentre ici! voici img:", img);
                img.src = URL.createObjectURL(blob);
                img.classList.remove("invisible");
            }
        }
        catch (error) {
            console.error("Erreur lors de la récupération du QR code:", error);
        }
    }
    handleEmailCode() {
        alert("Email 2FA not yet implemented.");
    }
    eventUpdate(container) {
        eventBus.register("update:user", (message) => {
            console.log("salutmonpotteee");
            const msgDiv = container.querySelector("#update-msg");
            if (msgDiv)
                msgDiv.textContent = message;
        });
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
