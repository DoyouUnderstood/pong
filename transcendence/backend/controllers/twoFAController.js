import { sendEmail, generateCode, saveCode, verifyCode} from '../services/emailService.js';
import { getUserByUsername } from '../models/userModels.js';
export async function mail2FAsetup(request, reply) 
{
  const user = request.user;
  const email = user.email;
    const code = generateCode();
    console.log("voici le code");
    await saveCode(user, code);

  try {
    await sendEmail(email, code);
    reply.send({ message: "Code 2FA envoyé par email." });
  } catch (err) {
    console.error(err);
    reply.status(500).send({ message: "Erreur lors de l'envoi du mail 2FA." });
  }
}

export async function verify2FAemail(request, reply, userService)
{
    const user = request.user;
    const code = request.body.code;
    console.log(code);
    const user2 = await getUserByUsername(user.username);

    await verifyCode(user2.id, code);
    await userService.enable2FA(user2.id);
    reply.status(200).send({message: "Code bon 2FA active avec succes!"});
}
export async function generate2FA(request, reply) {
  try {
    const user = request.user;
    const { authService } = request.server.container;
    const { otpauth_url } = await authService.setup2FA(user);

    reply.send({ otpauth_url });
  } catch (err) {
    reply.status(500).send({ message: "Erreur lors de la génération du QR code." });
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

    reply.send({ message: "2FA activé avec succès ✅" });
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

