import { FastifyReply, FastifyRequest } from 'fastify';
import { Status } from '../status';

export function verifyUserRole(roleToVerify: 'ADMIN' | 'MEMBER') {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const { role } = request.user;

        if (role !== roleToVerify) {
            return reply.status(Status.UNAUTHORIZED).send({message: 'Unauthorized.'});
        }
    };
}
