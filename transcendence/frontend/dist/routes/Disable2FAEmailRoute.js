import { twoFAService } from '../services/twoFAService.js';
import { getDigits } from "../utils/2fa.js"; // si tu factorises getDigits
export class Disable2FAEmailRoute {
    constructor() {
        this.partial = 'setup-2fa-email.html';
        this.authentification = "loginRequired";
    }
    async setup(container) {
        await twoFAService.sendDisableEmail();
        const code = await getDigits(container);
        const response = await twoFAService.verifyDisableEmailCode(code);
        this.displayMessage(container, response.message);
    }
    displayMessage(container, message) {
        const messageDiv = container.querySelector("#response-message");
        messageDiv.textContent = message;
    }
}
