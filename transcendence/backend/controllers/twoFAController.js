import { sendEmail, generateCode, saveCode, verifyEmailCode} from '../services/emailService.js';
import { getUserByUsername } from '../models/userModels.js';
import QRCode from 'qrcode'; // IMPORT en backend aussi


export async function verify2FAqrcode(request, reply, authService, userService)
{
    try {
        await authService.verify2FAQrCode(request.user.id, request.body.code);
        await userService.enable2FA(request.user.id, "qr-code");
       
        reply.status(200).send({message: "le code est bon !"});
    } catch(err)
    {
        reply.status(500).send({message: "le code est pas bon!"});
    }
}
export async function get2FAStatus(request, reply)
{
    const user = await getUserByUsername(request.user.username);
    const twoFAactivate = user.twoFAEnabled
    const method = user.twoFAMethod;
    if (twoFAactivate)
        reply.status(200).send({ twoFAEnabled: true, twoFAMethod: method});
    reply.status(200).send({twoFAEnabled: false});
}


export async function mail2FAsetup(request, reply) 
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
        const user = await getUserByUsername(request.user.username);
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
    const user = request.user;
    const { authService } = request.server.container;
    const { otpauth_url } = await authService.setup2FAQrCode(user);

    console.log("OTP URL ! ", otpauth_url);

    const qrCodeBuffer = await QRCode.toBuffer(otpauth_url);

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

export async function verify2FALogin(request, reply) {
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

