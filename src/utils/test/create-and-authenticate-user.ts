import { FastifyInstance } from 'fastify';
import request from 'supertest';

export async function createAndAuthenticateUser(app: FastifyInstance) {
    const userCredentials = {
        email: 'test@test.com',
        password: '123456'
    };

    const createUserResponse = await request(app.server)
        .post('/users')
        .send({
            name: 'Testing',
            ...userCredentials
        });
    
    const authResponse = await request(app.server)
        .post('/sessions')
        .send(userCredentials);

    const { token } = authResponse.body;
    const { id: userId } = createUserResponse.body;

    return { token, userId };
}
