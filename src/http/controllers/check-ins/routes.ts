import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { create } from 'domain';
import { validate } from './validate';



export async function checkInsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT);

    app.post('gyms/:gymId/check-ins', create);
    app.post('check-ins/:checkInId/validate', validate);
}
