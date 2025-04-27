export default function authServiceFactory({ userService, jwtLib, twoFAService }) {
  return {
    async login({ username, password }) {
        const user = await userService.login({ username, password });
        if (user.twofaEnabled) {
            return { twoFARequired: true, userId: user.id };
      }
      const token = jwtLib.sign({ id: user.id, username: user.username, email: user.email});
      return { token, user };
    },

    // async verifyEmailCode ({user, id})
    // {
    //     const 
    // },
    async verify2FA({ userId, code }) {
      const user = await userService.getById(userId);
      const isValid = twoFAService.verifyToken(user.totpSecret, code);
      if (!isValid) 
        throw new Error("Code 2FA invalide");
      const token = jwtLib.sign({ id: user.id, username: user.username, email: user.email});
      return { token, user };
    },

    async setup2FA(user) {
      const secret = twoFAService.generateSecret(user.username);
      await userService.save2FASecret(user.id, secret.base32);
      return { otpauth_url: secret.otpauth_url };
    },

    async enable2FA(userId, code) {
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
