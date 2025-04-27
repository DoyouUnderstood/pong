import fp from 'fastify-plugin';

export default fp(async function (fastify)
{
    fastify.decorateReply('sendSuccess', function(payload = {}, status = 200){
        this.code(status).send({
            status,
            sucess: true,
            ...payload
        });
    });
    fastify.decorateReply('sendError', function (message, status = 500) {
        this.code(status).send({
            status,
            success: false,
            message
    });
  });
});
