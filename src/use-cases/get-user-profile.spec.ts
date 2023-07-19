import { it, expect, describe, beforeEach } from 'vitest';
import { hash } from 'bcryptjs';
import { GetUserProfileUseCase } from './get-user-profile';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile UseCase', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileUseCase(usersRepository);
    });

    it('should be able to get user profile', async () => {

        const name = 'Test';

        const createdUser = await usersRepository.create({
            name,
            email: 'testeeee@email.com',
            password_hash: await hash('12345678910', 6)
        });

        await sut.execute({
            userId: createdUser.id
        });


        expect(createdUser.id).toEqual(expect.any(String));
        expect(createdUser.name).toEqual(name);
    });

    it('should not be able to get user profile with wrong id', async () => {

        await expect(() => sut.execute({
            userId: 'non-existing-id'
        })).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
});
