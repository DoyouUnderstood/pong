import { RouteI } from "../interfaces/RouteInterface";
import { twoFAService } from '../services/twoFAService.js';

export class Setup2FAQrCodeRoute implements RouteI
{
    partial = "setup-2fa-qrcode.html"
    authentification: "loginRequired" = "loginRequired";
    async setup(container: HTMLElement): Promise<void>
    {
        try {
        const blob = await twoFAService.setupQrCode();
        await this.handleQrCode(container, blob);
        const digits = await this.getdigits(container);
        const response = await twoFAService.verifyQrCode(digits);
        this.displayMessage(container, response.message);
        } catch(err: any)
        {   
            const message = err?.message || "erreur mauvais code"
            this.displayMessage(container, message);
        }
        
    }
    private displayMessage(container: HTMLElement, message: string)
    {
        const messageDiv = container.querySelector("#response-message") as HTMLElement;
        messageDiv.textContent = message;
    }


    private async handleQrCode(container: HTMLElement, blob: any) {
            const img = container.querySelector("#DisplayQr-code") as HTMLImageElement;
            if (img) {
                img.src = URL.createObjectURL(blob);
                img.classList.remove("invisible");

            }
    }
    
    private async getdigits(container: HTMLElement): Promise<string> {
        return new Promise((resolve) => {
            const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[data-2fa]'));
            const getCode = () => inputs.map(i => i.value).join('');
            const checkComplete = () => {
                const code = getCode();
                if (code.length === inputs.length && /^\d{6}$/.test(code)) {
                    resolve(code);
                }
            };
            inputs.forEach((input, index) => {
                input.addEventListener('input', () => {
                    if (input.value.length === 1 && index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    }
                    checkComplete();
                });
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Backspace' && input.value === '' && index > 0) {
                        inputs[index - 1].focus();
                    }
                });
            });
        });
    }
}
