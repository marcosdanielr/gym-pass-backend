import { FastifyReply, FastifyRequest } from 'fastify';
import { Status } from '../status';
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
    const currentUserId = request.user.sub;

    const getUserProfile = makeGetUserProfileUseCase();

    const { user } = await getUserProfile.execute({
        userId: currentUserId
    });

    return reply.status(Status.OK).send({
        user: {
            ...user,
            password_hash: undefined
        }
    });
}
