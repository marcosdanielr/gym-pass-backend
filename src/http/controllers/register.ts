import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { Status } from '../status';

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6)
	});

	const { name, email, password } = registerBodySchema.parse(request.body);

	const password_hash = await hash(password, 6);

	const userExists = await prisma.user.findUnique({
		where: {
			email
		}
	});

	if(userExists) {
		return reply.status(Status.CONFLICT).send();
	}

	const response = await prisma.user.create({
		data: {
			name,
			email,
			password_hash
		}
	});

	return reply.status(Status.CREATED).send({
		...response,
		password_hash
	});
}
