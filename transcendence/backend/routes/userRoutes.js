import { connectUser } from '../controllers/userController.js';
import { signupUser , updateUser } from '../controllers/userController.js';

export default async function (fastify, { userService, jwtService }) {
    fastify.post('/api/login', (request, reply) => connectUser(request, reply, userService, jwtService));
    fastify.post('/api/signup', (request, reply) => signupUser(request, reply, userService));
    fastify.post('/api/update', (request, reply) => updateUser(request, reply, userService));
    fastify.post('/api/logout', (req, res) => {
  // Clear the JWT cookie
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  });
        console.log("PETASSE");
console.log("salut mon pote !!!!!!!!", res.cookie[jwt]);

  res.send({ message: "Logged out successfully" });
});
}

