import fp from 'fastify-plugin'
import fastifyBcrypt from 'fastify-bcrypt'

export default fp(async function (fastify, opts) {
  fastify.register(fastifyBcrypt, {
    saltWorkFactor: 12
  })
})

