import speakeasy from 'speakeasy';

export default function twoFAServiceFactory() {
  return {
    generateSecret(username) {
      return speakeasy.generateSecret({ name: `PingPong (${username})` });
    },

    verifyToken(secret, token) {
      return speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window: 1,
      });
    }
  };
}

