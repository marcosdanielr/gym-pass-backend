import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import { Status } from '../../status';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Create Gym (e2e)', () => {
    beforeAll(async() => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to create a gym', async () => {

        const { token } = await createAndAuthenticateUser(app, 'ADMIN');

        const response = await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Testing',
                description: '^^',
                phone: '9898989899',
                latitude: 35.8113216,
                longitude: -109.6255108
            });

        expect(response.statusCode).toEqual(Status.CREATED);
        expect(response.body.gym).toEqual(expect.objectContaining({
            id: expect.any(String)
        }));
    });
});
