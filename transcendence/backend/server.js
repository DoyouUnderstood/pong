// Import the framework and instantiate it
import Fastify from 'fastify'
import sqlite3 from "sqlite3";
import { execute } from './sql.js';

const fastify = Fastify({
  logger:    true
})


const main = async () => {
    const db = new sqlite3.Database("tr.db");
    try {
        await execute(
            db,
        `CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            email TEXT NOT NULL
        );`
        );
    } catch (error) {
        console.log(error);
    } finally {
        db.close();
    }
};

main();


fastify.get('/', async function handler (request, reply) {
  return { hello: 'bruh' }
})

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
