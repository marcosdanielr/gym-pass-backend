import { FastifyReply, FastifyRequest } from 'fastify';
import { Status } from '../../status';
import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case';

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
    const getUserMetricsUseCase = makeGetUserMetricsUseCase();

    const checkInsCount = await getUserMetricsUseCase.execute({
        userId: request.user.sub,
    });

    return reply.status(Status.OK).send(checkInsCount);
}
