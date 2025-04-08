import { connectUser } from '../controllers/userController.js';
import { signupUser } from '../controllers/userController.js';
export default async function (fastify) {
    fastify.post('/api/login', connectUser);
    fastify.post('/api/signup', signupUser);
}

