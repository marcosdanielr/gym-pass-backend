import fastify from 'fastify';
import { appRoutes } from './http/routes';
import { ZodError } from 'zod';
import { Status } from './http/status';
import { env } from './env';

export const app = fastify();

app.register(appRoutes);

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
