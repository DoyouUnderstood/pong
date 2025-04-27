export default function jwtMiddlewareFactory() 
{
  return async function jwtMiddleware(request, reply) {
    const path = request.routeOptions?.url || request.raw.url;

    const publicPaths = [
      '/api/signup',
      '/api/login',
      '/api/login/2fa',
    ];

    if (publicPaths.includes(path)) {
      return;
    }

    try {
      await request.verifyToken(reply);
    } catch (err) {
      return reply.code(401).send({ message: 'Token invalide' });
    }
  };
}

