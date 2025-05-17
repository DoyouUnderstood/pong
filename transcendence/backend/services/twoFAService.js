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
    },
generateOtpauthUrl(username, secretBase32) {
  return speakeasy.otpauthURL({
    secret: secretBase32,
    encoding: 'base32',
    label: `PingPong (${username})`
  });
}
  };
}

