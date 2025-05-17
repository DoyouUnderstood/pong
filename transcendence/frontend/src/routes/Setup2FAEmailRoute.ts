import { RouteI } from "../interfaces/RouteInterface.js";
import { twoFAService } from '../services/twoFAService.js';

export class Setup2FAEmailRoute implements RouteI
{
    partial = 'setup-2fa-email.html'
    authentification: "loginRequired" = "loginRequired";

async setup(container: HTMLElement): Promise<void> {
    this.handleResendButton(container);
    
    try {
            await this.sendEmail(container);      
        } catch (error: any) {
            const message = error?.response?.message || "Erreur lors de la vérification du code .";
            this.displayMessage(container, message);
        }
    }

    private displayMessage(container: HTMLElement, message: string)
    {
        const messageDiv = container.querySelector("#response-message") as HTMLElement;
        messageDiv.textContent= message;
    }

    private handleResendButton(container: HTMLElement)
    {
        const button = container.querySelector("#button-resend") as HTMLElement;
        button?.addEventListener("click", () => {
            this.sendEmail(container);
        })
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
    private async sendEmail(container: HTMLElement) {
        await twoFAService.setupEmail();
        const digits = await this.getdigits(container);
        const response = await twoFAService.verifyEmailCode(digits);
        this.displayMessage(container, response.message);
    }

}
