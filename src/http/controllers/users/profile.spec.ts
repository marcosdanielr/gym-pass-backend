import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import { Status } from '../../status';

describe('Profile (e2e)', () => {
    beforeAll(async() => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to get user profile', async () => {
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
    
        const authResponse = await request(app.server)
            .post('/sessions')
            .send(userCredentials);

        const { token } = authResponse.body;

        const profileResponse = await request(app.server)
            .get('/me')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(profileResponse.statusCode).toEqual(Status.OK);
        expect(profileResponse.body.user).toEqual(expect.objectContaining({
            email: userCredentials.email
        }));
    });
});
