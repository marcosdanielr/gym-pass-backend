import fastify from 'fastify';
import { ZodError } from 'zod';
import { Status } from './http/status';
import { env } from './env';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';

import { usersRoutes } from './http/controllers/users/routes';
import { gymsRoutes } from './http/controllers/gyms/routes';
import { checkInsRoutes } from './http/controllers/check-ins/routes';

export const app = fastify();

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false
    },
    sign: {
        expiresIn: '10m'
    }
});

app.register(fastifyCookie);

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply
            .status(Status.BAD_REQUEST)
            .send({message: 'Validation error.', issues: error.format()});
    }

    if (env.NODE_ENV !== 'prod') {
        console.error(error);
    }

    return reply.status(Status.INTERNAL_SERVER_ERROR).send({message: 'Internal server error.'});
});
