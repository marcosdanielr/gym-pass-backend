import { it, expect, describe } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

describe('Register Use Case', () => {
    it('should be able to register', async () => {

        const userRepository = new InMemoryUsersRepository();
        const registerUserCase = new RegisterUseCase(userRepository);

        const { user } =  await registerUserCase.execute({
            name: 'Teste',
            email: 'teste2@teste.com',
            password: '12345678'
        });


        expect(user.id).toEqual(expect.any(String));
    });

    it('should has user password open registration', async () => {

        const userRepository = new InMemoryUsersRepository();
        const registerUserCase = new RegisterUseCase(userRepository);

        const { user } =  await registerUserCase.execute({
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

        const userRepository = new InMemoryUsersRepository();
        const registerUserCase = new RegisterUseCase(userRepository);

        const email = 'test@email.com';

        await registerUserCase.execute({
            name: 'Test',
            email,
            password: '12345678'
        });

        expect(() => 
            registerUserCase.execute({
                name: 'Test2',
                email,
                password: '123456789'
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
});
