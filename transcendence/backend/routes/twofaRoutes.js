import 
{
    generate2FA,  
    verify2FAemail,
    verify2FALogin,
    mail2FAsetup
}   from '../controllers/twoFAController.js';

export default async function (fastify, {userService}) 
{
    //console.log("VOICI USER DANS ROUTE", request.user);
    fastify.post('/api/2fa/mail/setup', (request, reply) => mail2FAsetup(request, reply, userService));

    fastify.post('/api/2fa/setup', generate2FA);
    fastify.post('/api/2fa/verify', (request, reply) => verify2FAemail(request, reply, userService));
    fastify.post('/api/2fa/login', verify2FALogin);

}

