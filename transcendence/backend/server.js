import Fastify from 'fastify'
import { initDB } from './db/init.js'
import userRoute from './routes/userRoutes.js'
import authRoute from './routes/twofaRoutes.js'
import jwt from './plugins/jwtPlugins.js'
import { buildContainer } from './container.js'
import cookie from '@fastify/cookie'
import dotenv from 'dotenv';
import jwtMiddlewareFactory from './middleware/jwtMiddleware.js';
import customReply from './plugins/customReply.js';


dotenv.config();

await initDB()

const fastify = Fastify({
  logger: true,
})
await fastify.register(jwt)
await fastify.register(customReply);
fastify.register(cookie, {
  secret: "my-secret",
  parseOptions: {}
})

fastify.addHook('onRequest', jwtMiddlewareFactory(fastify));

const container = buildContainer()
fastify.decorate('container', container)

await userRoute(fastify, container);
await authRoute(fastify, container);
try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

