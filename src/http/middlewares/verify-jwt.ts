import { FastifyReply, FastifyRequest } from 'fastify';
import { Status } from '../status';

export async function verifyJWT(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        await request.jwtVerify();
    } catch (error) {
        return reply.status(Status.UNAUTHORIZED).send({message: 'Unauthorized.'});
    }

}
