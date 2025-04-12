import { connectUser } from '../controllers/userController.js';
import { signupUser , updateUser } from '../controllers/userController.js';

export default async function (fastify) {
    fastify.post('/api/login', connectUser);
    fastify.post('/api/signup', signupUser);
    fastify.post('/api/update', updateUser);
}

