import { it, expect, describe, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(usersRepository);
    });

    it('should be able to authenticate', async () => {
        const email = 'test@email.com';
        const password = '12345678';

        await usersRepository.create({
            name: 'Test',
            email,
            password_hash: await hash(password, 6)
        });

        const { user } = await sut.execute({
            email,
            password
        });


        expect(user.id).toEqual(expect.any(String));
    });

    it('should not be able to authenticate with wrong email', async () => {
        const email = 'testtttttttttttttttt@email.com';
        const password = '12345678';

        await expect(() => sut.execute({
            email,
            password
        })).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        const email = 'test@email.com';
        const password = '12345678';

        await usersRepository.create({
            name: 'Test',
            email,
            password_hash: await hash(password, 6)
        });

        await expect(() => sut.execute({
            email,
            password: '12345678910'
        })).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});
