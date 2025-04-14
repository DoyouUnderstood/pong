import { connectUser } from '../controllers/userController.js';
import { signupUser , updateUser } from '../controllers/userController.js';

export default async function (fastify, { userService }) {
    fastify.post('/api/login', (request, reply) => connectUser(request, reply, userService));
    fastify.post('/api/signup', (request, reply) => signupUser(request, reply, userService));
    fastify.post('/api/update', (request, reply) => updateUser(request, reply, userService));
}

