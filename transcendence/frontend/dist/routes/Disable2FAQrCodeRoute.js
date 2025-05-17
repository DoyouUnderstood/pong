import { twoFAService } from '../services/twoFAService.js';
import { getDigits } from "../utils/2fa.js";
export class Disable2FAQrCodeRoute {
    constructor() {
        this.partial = 'setup-2fa-qrcode.html';
        this.authentification = "loginRequired";
    }
    async setup(container) {
        const code = await getDigits(container);
        try {
            const response = await twoFAService.verifyDisableQrCode(code);
            this.displayMessage(container, response.message);
        }
        catch (err) {
            this.displayMessage(container, "Erreur dans le verification du code");
        }
    }
    displayMessage(container, message) {
        const messageDiv = container.querySelector("#response-message");
        messageDiv.textContent = message;
    }
}
