import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import { Status } from '../../status';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Validate Check-in (e2e)', () => {
    beforeAll(async() => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to validate a check-in', async () => {

        const { token, userId } = await createAndAuthenticateUser(app, 'ADMIN');

        const gym = await prisma.gym.create({
            data: {
                title: 'TheDuckGym',
                latitude: 35.8113216,
                longitude: -109.6255108
            }
        });

        const checkIn = await prisma.checkIn.create({
            data: {
                gym_id: gym.id,
                user_id: userId,
            }
        });

        const response = await request(app.server)
            .patch(`/check-ins/${checkIn.id}/validate`)
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(Status.NO_CONTENT);
    });
});
