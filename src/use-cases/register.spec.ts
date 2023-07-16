import { it, expect, describe } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';

describe('Register Use Case', () => {
    it('should has user password open registration', async () => {
        const registerUserCase = new RegisterUseCase({
            async findByEmail(email) {
                return null;
            },

            async create(data) {
                return {
                    id: 'user-1',
                    name: data.name,
                    email: data.email,
                    password_hash: data.password_hash,
                    created_at: new Date()
                };
            }
        });

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
});
