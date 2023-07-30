import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import request from 'supertest';

export async function createAndAuthenticateUser(app: FastifyInstance, role: 'ADMIN' | 'MEMBER' = 'MEMBER') {


    const createUserResponse = await prisma.user.create({
        data: {
            name: 'Testing',
            email: 'test@test.com',
            password_hash: await hash('123456', 6),
            role
        }
    }); 
    
    const authResponse = await request(app.server)
        .post('/sessions')
        .send({
            email: 'test@test.com',
            password: '123456'
        });

    const { token } = authResponse.body;
    const { id: userId } = createUserResponse;

    return { token, userId };
}
