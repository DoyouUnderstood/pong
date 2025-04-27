import fp from 'fastify-plugin';
import { jwtLib } from './jwtLib.js';

export default fp(async (fastify) => {
  
  fastify.decorate('generateToken', (payload) => {
    return jwtLib.sign(payload);
  });

  fastify.decorateRequest('verifyToken', async function (reply) {
    try {
      const jwt_cookie = this.cookies['jwt'];
      if (!jwt_cookie) throw new Error('Pas de cookies');

      const decoded = jwtLib.verify(jwt_cookie);
      this.user = decoded;
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      reply.code(401).send({ message: "Non autorise !" });
    }
  });

});
