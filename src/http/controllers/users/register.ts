import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { Status } from '../../status';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case';

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    });

    const { name, email, password } = registerBodySchema.parse(request.body);

    try {
        const registerUseCase = makeRegisterUseCase();

        const { user } = await registerUseCase.execute({
            name, email, password
        });

        return reply.status(Status.CREATED).send({
            ...user,
            password_hash: undefined,
            role: undefined
        });
    } catch (err) {
        if (err instanceof UserAlreadyExistsError) {
            return reply.status(Status.CONFLICT).send({ message: err.message });
        }

        throw err;
    }
}
