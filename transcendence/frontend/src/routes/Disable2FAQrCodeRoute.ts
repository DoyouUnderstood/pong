import { RouteI } from "../interfaces/RouteInterface.js";
import { twoFAService } from '../services/twoFAService.js';
import { getDigits } from "../utils/2fa.js";

export class Disable2FAQrCodeRoute implements RouteI {
    partial = 'setup-2fa-qrcode.html';
    authentification: "loginRequired" = "loginRequired";

    async setup(container: HTMLElement): Promise<void> {

        const code = await getDigits(container);
        try{
            const response = await twoFAService.verifyDisableQrCode(code);
            this.displayMessage(container, response.message);
        } catch (err)
        {
            this.displayMessage(container,"Erreur dans le verification du code");
        }
    }

    private displayMessage(container: HTMLElement, message: string) {
        const messageDiv = container.querySelector("#response-message") as HTMLElement;
        messageDiv.textContent = message;
    }
}

