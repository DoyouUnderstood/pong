import speakeasy from 'speakeasy';
import { throwIf, logDebug } from '../utils/errors.js';

export default function authServiceFactory({ userService, jwtLib, twoFAService }) {
  return {
    async login({ username, password }) {
      const user = await userService.validateCredentials({ username, password });

      if (user.twofaEnabled) {
        return {
          twoFAMethod: user.twoFAMethod,
          twoFARequired: true,
          userId: user.id,
        };
      }

      const token = jwtLib.sign({
        id: user.id,
        username: user.username,
        email: user.email,
      });

      return { token, user };
    },

    async confirm2FAQrCodeSetup(userId, token) {
      const secretResult = await userService.getSecret(userId);

      throwIf(!secretResult || !secretResult.totpSecret, "Pas de secret 2FA enregistré pour cet utilisateur.");

      const secret = secretResult.totpSecret;

      const expectedToken = speakeasy.totp({ secret, encoding: 'base32' });

      logDebug("Secret actuel", secret);
      logDebug("Token reçu", token);
      logDebug("Token attendu maintenant", expectedToken);

      const isValid = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window: 1,
      });

      throwIf(!isValid, "Code 2FA invalide");

      return true;
    },

    async setup2FAQrCode(user) {
      const secret = twoFAService.generateSecret(user.username);

      await userService.saveTemp2FASecret(user.id, secret.base32);
      const otpauth_url = twoFAService.generateOtpauthUrl(user.username, secret.base32);

      return { otpauth_url };
    },

    async enable2FAQrCode(userId, code) {
      const user = await userService.getById(userId);
      const isValid = twoFAService.verifyToken(user.totpSecret, code);

      throwIf(!isValid, "Code 2FA invalide");

      await userService.enable2FA(userId, "qr-code");
      return { success: true };
    },
  };
}

