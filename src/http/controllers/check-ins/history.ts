import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { Status } from '../../status';
import { makeFetchUserCheckInsUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-use-case';

export async function history(request: FastifyRequest, reply: FastifyReply) {
    const checkInHistoryQuerySchema = z.object({
        page: z.coerce.number().min(1).default(1)
    });

    const {  page } = checkInHistoryQuerySchema.parse(request.query);

    const fetchUserCeckInHistoryUseCase = makeFetchUserCheckInsUseCase();

    const checkIns = await fetchUserCeckInHistoryUseCase.execute({
        userId: request.user.sub,
        page,
    });

    return reply.status(Status.OK).send(checkIns);
}
