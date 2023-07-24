import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { Status } from '../../status';
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case';
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms';

export async function search(request: FastifyRequest, reply: FastifyReply) {
    const nearbyGymsQuerySchema = z.object({
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90;
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180;
        }),
    });

    const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.body);

    const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase();

    const gyms = await fetchNearbyGymsUseCase.execute({
        userLatitude: latitude,
        userLongitude: longitude
    });

    return reply.status(Status.OK).send({gyms});
}
