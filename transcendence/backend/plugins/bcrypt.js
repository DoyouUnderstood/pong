import fastifyBcrypt from 'fastify-bcrypt'

export default async function bcryptPlugin(fastify, opts) {
  fastify.register(fastifyBcrypt, {
    saltWorkFactor: 12,
  })
}

