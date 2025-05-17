import { RouteI } from "../interfaces/RouteInterface.js";
import { twoFAService } from '../services/twoFAService.js';
import { getDigits } from "../utils/2fa.js"; // si tu factorises getDigits

export class Disable2FAEmailRoute implements RouteI {
    partial = 'setup-2fa-email.html';
    authentification: "loginRequired" = "loginRequired";

    async setup(container: HTMLElement): Promise<void> {
        await twoFAService.sendDisableEmail();

        const code = await getDigits(container);
        const response = await twoFAService.verifyDisableEmailCode(code);

        this.displayMessage(container, response.message);
    }

    private displayMessage(container: HTMLElement, message: string) {
        const messageDiv = container.querySelector("#response-message") as HTMLElement;
        messageDiv.textContent = message;
    }
}

