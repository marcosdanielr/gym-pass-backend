import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import { Status } from '../../status';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

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

        const { token } = await createAndAuthenticateUser(app);

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
