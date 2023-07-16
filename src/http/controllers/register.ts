import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { Status } from '../status';
import { RegisterUseCase } from '@/use-cases/register';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    });

    const { name, email, password } = registerBodySchema.parse(request.body);

    const prismaUsersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(prismaUsersRepository);

    try {
        const response = await registerUseCase.execute({
            name, email,password
        });

        return reply.status(Status.CREATED).send({
            ...response,
            password_hash: undefined
        });
    } catch (err) {
      
        if(err instanceof UserAlreadyExistsError) {
            return reply.status(Status.CONFLICT).send({message: err.message});
        }

        throw err;

    }
}
