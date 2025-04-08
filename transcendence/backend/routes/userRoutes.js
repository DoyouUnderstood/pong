import { createUser } from '../controllers/userController.js';

export default async function (fastify) {
  fastify.post('/api/user', createUser);
}

