import 
{
    verify2FAemail,
    verify2FALogin,
    mail2FAsetup,
    get2FAStatus,
    generate2FAQrCode,
    verify2FAqrcode
}   from '../controllers/twoFAController.js';

export default async function (fastify, {userService, authService}) 
{
    //console.log("VOICI USER DANS ROUTE", request.user);
    fastify.post('/api/2fa/mail/setup', (request, reply) => mail2FAsetup(request, reply, userService));
    fastify.get('/api/2fa/status', (request, reply) => get2FAStatus(request, reply));
    //fastify.post('/api/2fa/setup', generate2FA);
    fastify.post('/api/2fa/verify', (request, reply) => verify2FAemail(request, reply, userService));
    fastify.post('/api/2fa/login', verify2FALogin);
    fastify.get('/api/2fa/qr-code/setup', (request, reply) => generate2FAQrCode(request, reply));
    fastify.post('/api/2fa/qr-code/verify',(request, reply) => verify2FAqrcode(request, reply, authService, userService));
}

