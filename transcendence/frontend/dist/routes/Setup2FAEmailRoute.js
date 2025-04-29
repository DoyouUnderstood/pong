import { AuthService } from '../services/authService.js';
import { Api } from '../services/api.js';
export class Setup2FAEmailRoute {
    constructor() {
        this.partial = 'setup-2fa-email.html';
        this.authentification = "loginRequired";
    }
    async setup(container) {
        this.handleResendButton(container);
        try {
            await this.sendEmail(container);
        }
        catch (error) {
            const message = error?.response?.message || "Erreur lors de la vérification du code .";
            this.displayMessage(container, message);
        }
    }
    displayMessage(container, message) {
        const messageDiv = container.querySelector("#response-message");
        messageDiv.textContent = message;
    }
    handleResendButton(container) {
        const button = container.querySelector("#button-resend");
        button?.addEventListener("click", () => {
            this.sendEmail(container);
        });
    }
    async getdigits(container) {
        return new Promise((resolve) => {
            const inputs = Array.from(container.querySelectorAll('input[data-2fa]'));
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
    async sendEmail(container) {
        const user = AuthService.getCurrentUser();
        await Api.post('2fa/mail/setup', user);
        const digits = await this.getdigits(container);
        const response = await this.verifyDigits(digits);
        this.displayMessage(container, response.message);
    }
    async verifyDigits(code) {
        const currentuser = AuthService.getCurrentUser();
        const user = {
            code: code,
            user: currentuser,
            twoFAMethod: "email"
        };
        const response = await Api.post('2fa/verify', user);
        return response;
    }
}
