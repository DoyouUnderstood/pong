import Fastify from 'fastify'
import { initDB } from './db/init.js'
import userRoute from './routes/userRoutes.js'
import bcryptPlugin from './plugins/bcrypt.js'
import jwt from './plugins/jwt.js'
import { buildContainer } from './container.js'
import cookie from '@fastify/cookie'
import dotenv from 'dotenv';
import twilio from 'twilio';


dotenv.config();

const accountSid = process.env.SID_SERVICE;
const authToken = process.env.AUTH_TOKEN;

const client = twilio(accountSid, authToken);

await initDB()

const fastify = Fastify({
  logger: true,
})

console.log("ENV:", process.env.SID_SERVICE, process.env.AUTH_TOKEN, process.env.PHONE);

await fastify.register(bcryptPlugin)
await fastify.register(jwt)
fastify.register(cookie, {
  secret: "my-secret", // for cookies signature
  parseOptions: {}     // options for parsing cookies
})


fastify.post('/api/send-sms', async (req, res) => {
  const { to, message } = req.body;

  try {
      console.log("Numéro vers lequel j'envoie le SMS :", to);

    const msg = await client.messages.create({
      body: message,
      from: process.env.PHONE,
      to: to,
    });
    return { sid: msg.sid };
  } catch (err) {
      console.error("Twilio Error:", err);
  res.code(500).send({ error: err.message });
  }
});

// essai de hooks pour jwt !

fastify.addHook('preHandler', (request, reply, done) => {
  const path = request.routerPath || request.raw.url;

    console.log(path);
  // Paths that should be public
  const publicPaths = ['/api/signup', '/api/login'];

  if (publicPaths.includes(path)) {
    return done();
  }
const token = request.cookies['jwt'];
    console.log(token);
if (!token) {
  return reply.code(401).send({ message: "Non autorisé !" });
}

fastify.verifyToken(request, reply)
  .then(done)
  .catch((err) => {
    console.error("Token invalid:", err);
    reply.code(401).send({ message: "Token invalide" });
  }); 

})

fastify.get('/api/me', async (request, reply) => {
  try {
    console.log("ICI COOOOKIES !", request.cookies['jwt'])
    await fastify.verifyToken(request, reply);
    return { user: request.user };
  } catch (err) {
    reply.code(401).send({ message: "Non autorise" });
  }
});

const container = buildContainer({ bcrypt: fastify.bcrypt, jwt: fastify.jwt })
await userRoute(fastify, container)

fastify.get('/', async function handler(request, reply) {
  return { hello: 'bruh' }
})

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

