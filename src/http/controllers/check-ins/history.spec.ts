import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import { Status } from '../../status';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('History Check-in (e2e)', () => {
    beforeAll(async() => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to list the history of check-ins', async () => {

        const { token, userId } = await createAndAuthenticateUser(app);

        const gym = await prisma.gym.create({
            data: {
                title: 'Duck Gym',
                latitude: 35.8113216,
                longitude: -109.6255108
            }
        });

        await prisma.checkIn.createMany({
            data: [
                {
                    gym_id: gym.id,
                    user_id: userId
                },
                {
                    gym_id: gym.id,
                    user_id: userId 
                },
            ]
        });

        const response = await request(app.server)
            .get('/check-ins/history')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(Status.OK);
        expect(response.body.checkIns).toEqual([
            expect.objectContaining({
                gym_id: gym.id,
                user_id: userId 
            }),
            expect.objectContaining({
                gym_id: gym.id,
                user_id: userId 
            })
        ]);
    });
});
