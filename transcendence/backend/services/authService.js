
export default function authServiceFactory({ userService, jwtLib, twoFAService }) {
  return {
    async login({ username, password }) {
        const user = await userService.validateCredentials({ username, password });
        if (user.twofaEnabled) {
            return {twoFAMethod: user.twoFAMethod, twoFARequired: true, userId: user.id };
      }
      const token = jwtLib.sign({ id: user.id, username: user.username, email: user.email});
      return { token, user };
    },
async verify2FAQrCode(userId, code) {
    const secretResult = await userService.getSecret(userId);
    console.log("ceci est le secret! et l'id:", secretResult, userId);
    if (!secretResult || !secretResult.totpSecret) {
        throw new Error("Pas de secret 2FA enregistré pour cet utilisateur.");
    }

    const { totpSecret } = secretResult;

    const user = await userService.getById(userId);
    const isValid = twoFAService.verifyToken(totpSecret, code);
    if (!isValid) 
        throw new Error("Code 2FA invalide");
    return { user };
},

    async setup2FAQrCode(user) {
      const secret = twoFAService.generateSecret(user.username);
      await userService.save2FASecret(user.id, secret.base32);
        await userService.enable2FA(user.id, "qr-code");
      return { otpauth_url: secret.otpauth_url };
    },

    async enable2FAQrCode(userId, code) {
      const user = await userService.getById(userId);
      const isValid = twoFAService.verifyToken(user.totpSecret, code);
        if (!isValid)
        {
            throw new Error("Code 2FA invalide");
        }
        await userService.enable2FA(userId);
        return { success: true };
    }
  };
}
