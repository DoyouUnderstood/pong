
/**
 * Récupère le code 2FA depuis un conteneur HTML.
 * Attend que tous les champs soient remplis correctement.
 */

export async function getDigits(container: HTMLElement): Promise<string> {
    return new Promise((resolve) => {
        const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[data-2fa]'));

        const getCode = () => inputs.map(input => input.value).join('');
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

