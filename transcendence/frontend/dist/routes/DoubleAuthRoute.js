import { Api } from '../services/api.js';
import { AuthService } from '../services/authService.js';
export class DoubleAuthRoute {
    constructor() {
        this.partial = 'doubleauth.html';
        this.authentification = "loginRequired";
    }
    async setup(container) {
        await this.setupEmailMethod(container);
        await this.sendEmail();
        const digits = await this.getdigits(container);
        const response = await this.verifyDigits(digits);
        if (response.status == 200)
            this.activate_2fa();
        // drawResponse();
    }
    activate_2fa() {
        return;
    }
    async setupEmailMethod(container) {
        return new Promise(async (resolve) => {
            const divEmail = container.querySelector("#twofaEmail");
            const response = await fetch("/html/emailAuth.html");
            const emailswap = await response.text();
            divEmail.addEventListener("click", () => {
                divEmail.innerHTML = emailswap;
                requestAnimationFrame(() => {
                    const firstInput = divEmail.querySelector('input[data-2fa]');
                    firstInput?.focus();
                    resolve(); // ✅ On continue quand le HTML est injecté
                });
            });
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
    async sendEmail() {
        const user = AuthService.getCurrentUser();
        console.log("Email de :", user?.email);
        await Api.post('2fa/mail/setup', user);
    }
    async verifyDigits(code) {
        console.log("🔐 Vérification du code:", code);
        const currentuser = AuthService.getCurrentUser();
        const user = {
            code: code,
            user: currentuser
        };
        const response = await Api.post('2fa/verify', user);
        return response;
    }
}
/*
  async setup(container: HTMLElement): Promise<void>
  {
    const test = container.querySelector("#twofaEmail") as HTMLElement;
    const new_html = await fetch("/html/emailAuth.html").then(res => res.text());

    test?.addEventListener("click", () => {
      test.innerHTML = new_html;
      this.setup2FAInputs(test);

      requestAnimationFrame(() => {
        const firstInput = test.querySelector('input[data-2fa]') as HTMLInputElement;
        firstInput?.focus();
      });
    });
  }
  private setup2FAInputs(container: HTMLElement) {
    const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[data-2fa]'));
    const getCode = () => inputs.map(i => i.value).join('');

    const checkComplete = () => {
      const code = getCode();
      if (code.length === inputs.length && /^\d{6}$/.test(code)) {
        console.log("Full code entered:", code);
        this.submitCode(code);
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
  }
  
  private submitCode(code: string) {
        const response = Api.post('2fa/mail/setup');
  }
  
}
*/
