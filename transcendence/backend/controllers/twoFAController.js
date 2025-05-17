import { sendEmail, generateCode, saveCode, verifyEmailCode} from '../services/emailService.js';
import { findUserByUsername } from '../models/userModels.js';
import QRCode from 'qrcode'; // IMPORT en backend aussi
import speakeasy from 'speakeasy'
/**
 * Demande de désactivation 2FA par email : envoi d'un code
 */
export async function disableUserTwoFAMail(request, reply) {
    try {
        const user = request.user;
        const code = generateCode();
        await saveCode(user, code);
        await sendEmail(user.email, code);
        reply.send({ message: "Code de désactivation envoyé par email." });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ message: "Erreur lors de l'envoi du mail de désactivation." });
    }
}

/**
 * Vérification du code pour désactiver 2FA email
 */
export async function verifyDisableMail(request, reply, userService) {
    try {
        const user = await findUserByUsername(request.user.username);
        const code = request.body.code;
        await verifyEmailCode(user.id, code);
        await userService.disableUserTwoFA(user.id);
        reply.status(200).send({ message: "2FA désactivé avec succès par email !" });
    } catch (err) {
        console.error(err);
        reply.status(400).send({ message: "Erreur lors de la vérification du code pour désactivation." });
    }
}


/**
 * Vérification du code pour désactiver 2FA par QR
 */
export async function verifyDisableQrCode(request, reply, authService, userService) {
    try {
        const userId = request.user.id;
        const { code } = request.body;

        await authService.confirm2FAQrCodeSetup(userId, code);
        await userService.disableUserTwoFA(userId);

        reply.status(200).send({ message: "2FA désactivé avec succès via QR Code !" });
    } catch (err) {
        console.error(err);
        reply.status(400).send({ message: "Erreur lors de la vérification du code QR pour désactivation." });
    }
}


export async function confirm2FAQrCodeSetup(request, reply, authService, userService) {
  const userId = request.user.id;
  const code = request.body.code;

    const user = await userService.getById(userId);
const tempSecret = user.twoFATempSecret;

  if (!tempSecret) {
    return reply.status(400).send({ message: "Aucun secret temporaire trouvé. Réessaye." });
  }
    console.log("Temp Secret:", tempSecret);
console.log("Code reçu :", code);

    const expected = speakeasy.totp({
  secret: tempSecret,
  encoding: 'base32'
});
console.log("Code attendu :", expected);

  const isValid = speakeasy.totp.verify({
    secret: tempSecret,
    encoding: 'base32',
    token: code,
    window: 1,
  });

  if (!isValid) {
    return reply.status(400).send({ message: "Code invalide." });
  }
await userService.save2FASecret(userId, tempSecret);
await userService.enable2FA(userId, "qr-code");
await userService.saveTemp2FASecret(userId, null);
  reply.status(200).send({ message: "2FA activé avec succès !" });
}
export async function get2FAStatus(request, reply)
{
    const user = await findUserByUsername(request.user.username);
    const twoFAactivate = user.twoFAEnabled
    const method = user.twoFAMethod;
    if (twoFAactivate)
        reply.status(200).send({ twoFAEnabled: true, twoFAMethod: method});
    reply.status(200).send({twoFAEnabled: false});
}


export async function send2FAEmailCode(request, reply) 
{
  const user = request.user;
  const email = user.email;
    const code = generateCode();
    console.log("voici le code", code);
    await saveCode(user, code);

  try {
    await sendEmail(email, code);
    reply.send({ message: "Code 2FA envoyé par email." });
  } catch (err) {
    console.error("voici l'erreur", err);
    reply.status(500).send({ message: "Erreur lors de l'envoi du mail 2FA." });
  }
}

export async function verify2FAemail(request, reply, userService)
{
    try {
        const code = request.body.code;
        const user = await findUserByUsername(request.user.username);
        await verifyEmailCode(user.id, code);
        await userService.enable2FA(user.id, request.body.twoFAMethod);
        reply.status(200).send({message: "Code bon 2FA active avec succes!"});
    }
    catch (err) {
        reply.status(500).send({message: "Erreur lors de la verification du code."});
    }
}

export async function generate2FAQrCode(request, reply) {
  try {
      console.log("wowowoow");
    const user = request.user;
    const { authService } = request.server.container;
    const { otpauth_url } = await authService.setup2FAQrCode(user);

    const qrCodeBuffer = await QRCode.toBuffer(otpauth_url);
    console.log("buffer!", qrCodeBuffer)
    reply
      .code(200)
      .header('Content-Type', 'image/png')
      .send(qrCodeBuffer);
  } catch (err) {
    console.log(err);
    reply.status(500).send({ message: "Erreur lors de la génération du QR code.", err });
  }
}
export async function verify2FASetup(request, reply) {
    
    console.log("CECI EST CENSE ETRE LE USER\n", request.body.user);
    console.log("ceci est cense etre le code ! ", request.body.code);
    const { code } = request.body.code;
    const user = request.body.user; 

  try {
    const { authService } = request.server.container;

    await authService.enable2FA(user.id, code);
    
    reply.send({ message: "2FA activé avec succès " });
  } catch (err) {
    reply.status(400).send({ message: err.message || "Code 2FA invalide" });
  }
}

export async function checkTwoFALoginCode(request, reply) {
  const { userId, code } = request.body;

  try {
    const { authService } = request.server.container;

   const result = await authService.verify2FA({ userId, code });

    reply.setCookie('jwt', result.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    }).send({
      message: "Connexion avec 2FA réussie",
      user: result.user,
    });

  } catch (err) {
    reply.status(401).send({ message: err.message || "Code 2FA invalide" });
  }
}

/*
    disableUserTwoFAMail,
    verifyDisableMail,
    disableUserTwoFAQrcode,
    verifyDisableQrCode
*/
