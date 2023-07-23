import { FastifyReply, FastifyRequest } from 'fastify';
import { Status } from '../status';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();

    console.log(request.user.sub);

    return reply.status(Status.OK).send();
}
