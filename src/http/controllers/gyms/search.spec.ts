import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import { Status } from '../../status';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Search Gyms (e2e)', () => {
    beforeAll(async() => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to search gyms by title', async () => {
        const { token } = await createAndAuthenticateUser(app);
        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Tá bom então',
                description: '^^',
                phone: '9898989899',
                latitude: 35.8113216,
                longitude: -109.6255108
            });
    
        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Testing 2',
                description: '^^',
                phone: '9898989899',
                latitude: 35.8113216,
                longitude: -109.6255108
            });

        const response = await request(app.server)
            .get('/gyms/search')
            .set('Authorization', `Bearer ${token}`)
            .query({
                query: 'bom'
            })
            .send();

        expect(response.statusCode).toEqual(Status.OK);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'Tá bom então'
            })
        ]);
    });
});
