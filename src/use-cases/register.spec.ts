import { it, expect, describe, beforeEach } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new RegisterUseCase(usersRepository);
    });

    it('should be able to register', async () => {
        const { user } = await sut.execute({
            name: 'Teste',
            email: 'teste2@teste.com',
            password: '12345678'
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it('should has user password open registration', async () => {
        const { user } = await sut.execute({
            name: 'Teste',
            email: 'teste2@teste.com',
            password: '12345678'
        });

        const isPasswordCorrectlyHashed = await compare(
            '12345678',
            user.password_hash
        );

        expect(isPasswordCorrectlyHashed).toBe(true);
    });

    it('should not be able to register user with duplicate email', async () => {
        const email = 'test@email.com';

        await sut.execute({
            name: 'Test',
            email,
            password: '12345678'
        });

        await expect(() =>
            sut.execute({
                name: 'Test2',
                email,
                password: '123456789'
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
});
