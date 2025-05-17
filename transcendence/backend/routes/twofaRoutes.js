import 
{
    verify2FAemail,
    checkTwoFALoginCode,
    send2FAEmailCode,
    get2FAStatus,
    //generate2FAQrCode,
    //confirm2FAQrCodeSetup,
    disableUserTwoFAMail,
    verifyDisableMail,
  //  verifyDisableQrCode
}   from '../controllers/twoFAController.js';

export default async function (fastify, {userService, authService}) 
{

    fastify.post('/api/2fa/mail/setup', (request, reply) => send2FAEmailCode(request, reply, userService));
    fastify.post('/api/2fa/mail/disable-setup', (request, reply) => disableUserTwoFAMail(request,reply));
    fastify.post('/api/2fa/mail/disable-verify', (request, reply) => verifyDisableMail(request, reply, userService));
    fastify.post('/api/2fa/verify', (request, reply) => verify2FAemail(request, reply, userService));

 /*
    fastify.get('/api/2fa/qr-code/setup', (request, reply) => generate2FAQrCode(request, reply));
    fastify.post('/api/2fa/qr-code/disable-verify', (request, reply) => verifyDisableQrCode(request, reply, authService, userService));
    fastify.post('/api/2fa/qr-code/verify',(request, reply) => confirm2FAQrCodeSetup(request, reply, authService, userService));
*/
    fastify.get('/api/2fa/status', (request, reply) => get2FAStatus(request, reply));
    fastify.post('/api/2fa/login', checkTwoFALoginCode);
}
