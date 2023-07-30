import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import { Status } from '../../status';

describe('Refresh Token (e2e)', () => {
    beforeAll(async() => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to refresh token', async () => {
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

        const cookies = authResponse.get('Set-Cookie');

        const response = await request(app.server)
            .patch('/token/refresh')
            .set('Cookie', cookies)
            .send();

        expect(response.statusCode).toEqual(Status.OK);
        expect(response.body).toEqual({
            token: expect.any(String)
        });
        expect(response.get('Set-Cookie')).toEqual([
            expect.stringContaining('refreshToken=')
        ]);
    });
});
