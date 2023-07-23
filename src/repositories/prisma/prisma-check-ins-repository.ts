import { prisma } from '@/lib/prisma';
import { CheckInsRepository } from '../check-ins-repository';
import { CheckIn, Prisma } from '@prisma/client';

export class PrismaCheckInsRepository implements CheckInsRepository {
    async create(data: Prisma.CheckInUncheckedCreateInput) {
        throw new Error();
    }

    save(checkIn: CheckIn) {
        throw new Error();
    }

    async findById(id: string){
        const checkIn = await prisma.checkIn.findUnique({
            where: {
                id
            }
        });

        return checkIn;
    }

    async countByUserId(userId: string) {
        return 0;
    }

    async findManyByUserId(userId: string, page: number) {
        return [];
    }

    async findByUserIdOnDate(userId: string, date: Date) {
        return null;
    }


}
