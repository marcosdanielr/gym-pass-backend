import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';

export function makeFetchUserCheckInsUseCase() {
    const checkInsRepository = new PrismaCheckInsRepository();
    const useCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository);

    return useCase;
} 
