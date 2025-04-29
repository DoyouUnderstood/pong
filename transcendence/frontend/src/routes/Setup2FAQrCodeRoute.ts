import { RouteI } from "../interfaces/RouteInterface";
import { Api } from '../services/api.js';
export class Setup2FAQrCodeRoute implements RouteI
{
    partial = "setup-2fa-qrcode.html"
    authentification: "loginRequired" = "loginRequired";
    async setup(container: HTMLElement): Promise<void>
    {
        try {
        await this.handleQrCode(container); 
        const digits = await this.getdigits(container);
        const response = await this.VerifyCode(digits);
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
    private async VerifyCode(code: string): Promise<any>
    {
        const response = await Api.post('2fa/qr-code/verify', code);
        return response.message;
    }
    private async handleQrCode(container: HTMLElement) {
        try {
               const response = await fetch("/api/2fa/qr-code/setup", {
            method: "GET",
            credentials: "include",
        });
            const blob = await response.blob();
            console.log(blob);
            const img = container.querySelector("#DisplayQr-code") as HTMLImageElement;
            if (img) {
                img.src = URL.createObjectURL(blob);
                img.classList.remove("invisible");

            }
        } catch (error) {
            console.error("Erreur lors de la récupération du QR code:", error);
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
