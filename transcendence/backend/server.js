// Import the framework and instantiate it
import Fastify from 'fastify'
import sqlite3 from "sqlite3";
import { execute } from './db/helpers.js';
import { initDB } from './db/init.js';

await initDB();
const fastify = Fastify({
  logger:    true
})

fastify.get('/', async function handler (request, reply) {
  return { hello: 'bruh' }
})

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
