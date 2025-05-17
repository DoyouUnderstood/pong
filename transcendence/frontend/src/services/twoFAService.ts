import { Api } from './api.js';
import { AuthService } from './authService.js';

class TwoFAService {

    async sendDisableEmail(): Promise<void> {
        const user = AuthService.getCurrentUser();
        await Api.post('2fa/mail/disable-setup', user);
    }

    async verifyDisableEmailCode(code: string): Promise<any> {
        const user = AuthService.getCurrentUser();
        return await Api.post('2fa/mail/disable-verify', {
            code,
            user,
            twoFAMethod: "email"
        });
    }

    async verifyDisableQrCode(code: string): Promise<any> {
        return await Api.post('2fa/qr-code/disable-verify', code);
    }

    async setupEmail(): Promise<void> {
        const user = AuthService.getCurrentUser();
        await Api.post('2fa/mail/setup', user);
    }

async setupQrCode(): Promise<Blob> {
    const response = await fetch("/api/2fa/qr-code/setup", {
        method: "GET",
        credentials: "include"
    });
    const blob = await response.blob();
    console.log("QR Code blob:", blob);
    return blob;
}

    async verifyEmailCode(code: string): Promise<any> {
        const user = AuthService.getCurrentUser();
        return await Api.post('2fa/verify', {
            code,
            user,
            twoFAMethod: "email"
        });
    }

    async verifyQrCode(code: string): Promise<any> {
        return await Api.post('2fa/qr-code/verify', { code } );
    }

    async disable2FA(code: string, method: "email" | "qr-code"): Promise<any> {
        return await Api.post('2fa/disable', { code, method });
    }

    async getStatus(): Promise<any> {
        return await Api.get('2fa/status');
    }
}

export const twoFAService = new TwoFAService();

