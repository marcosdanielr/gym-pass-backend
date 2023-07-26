import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import { Status } from '../../status';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Create Check-in (e2e)', () => {
    beforeAll(async() => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to create a check-in', async () => {

        const { token } = await createAndAuthenticateUser(app);

        const gym = await prisma.gym.create({
            data: {
                title: 'Duck Gym',
                latitude: 35.8113216,
                longitude: -109.6255108
            }
        });

        const response = await request(app.server)
            .post(`/gyms/${gym.id}/check-ins`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                userLatitude: 35.8113216,
                userLongitude: -109.6255108
            });

        expect(response.statusCode).toEqual(Status.CREATED);
    });
});
