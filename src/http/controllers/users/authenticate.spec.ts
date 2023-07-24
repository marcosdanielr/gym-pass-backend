import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import { Status } from '../../status';

describe('Authenticate (e2e)', () => {
    beforeAll(async() => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to authenticate', async () => {
        const userCredentials = {
            email: 'test@test.com',
            password: '123456'
        };

        await request(app.server)
            .post('/users')
            .send({
                name: 'Testing',
                ...userCredentials
            });
    
        const response = await request(app.server)
            .post('/sessions')
            .send(userCredentials);

        expect(response.statusCode).toEqual(Status.OK);
        expect(response.body).toEqual({
            token: expect.any(String)
        });
    });
});
