import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface RegisterUserCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({name, email, password}: RegisterUserCaseRequest) {
        const password_hash = await hash(password, 6);
        const userExists = await this.usersRepository.findByEmail(email);

        if (userExists) {
            throw new UserAlreadyExistsError();
        }

        const response = await this.usersRepository.create({
            name,
            email,
            password_hash
        });

        return response;
    }
}
