import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { Status } from '../status';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    });

    const { email, password } = authenticateBodySchema.parse(request.body);

    try {
        const authenticateUseCase = makeAuthenticateUseCase();

        const { user } = await authenticateUseCase.execute({
            email, password
        });

        const token = await reply.jwtSign({}, {
            sign: {
                sub: user.id
            }
        });

        return reply.status(Status.OK).send({
            token
        });

    } catch (err) {
        if (err instanceof InvalidCredentialsError) {
            return reply.status(Status.BAD_REQUEST).send({ message: err.message });
        }

        throw err;
    }
}
