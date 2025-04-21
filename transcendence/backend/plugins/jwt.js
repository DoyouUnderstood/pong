import dotenv from 'dotenv';

dotenv.config();

export const config = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
}

import fp from 'fastify-plugin'
import jwt from 'jsonwebtoken'

export default fp(async (fastify) => {
  
  // Générer un token
  fastify.decorate('generateToken', (payload) => {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn })
  })

  // Vérifier un token
  fastify.decorate('verifyToken', async (request, reply) => {
    try {
      const jwt_cookie = request.cookies['jwt'];
      if (!jwt_cookie) 
        throw new Error('Pas de cookies')

        const decoded = jwt.verify(jwt_cookie, config.jwtSecret)
        request.user = decoded;
    } catch (err) {
        console.error("JWT verification failed:", err.message)
        reply.code(401).send({ message: "Non autorise !"  })
    }
  })

})

