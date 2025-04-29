import { getUserCredential, connectUser, logoutUser } from '../controllers/userController.js';
import { signupUser , updateUser } from '../controllers/userController.js';

export default async function (fastify, { userService, authService}) {
    
fastify.get('/api/me', async (request, reply) => {
  try {
        console.log("check user cred route", request.user);
        await getUserCredential(request, reply, userService);
  } catch (err) {
    reply.code(401).send({ message: "Non autorise" });
  }
});


    fastify.post('/api/login', (request, reply) => connectUser(request, reply, authService));
    fastify.post('/api/signup', (request, reply) => signupUser(request, reply, userService));
    fastify.post('/api/update', (request, reply) => updateUser(request, reply, userService));
    fastify.post('/api/logout', (request, reply) => logoutUser(request, reply));
   
    }

