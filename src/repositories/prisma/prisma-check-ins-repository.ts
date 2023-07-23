import { prisma } from '@/lib/prisma';
import { CheckInsRepository } from '../check-ins-repository';
import { CheckIn, Prisma } from '@prisma/client';

export class PrismaCheckInsRepository implements CheckInsRepository {
    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = await prisma.checkIn.create({
            data
        });

        return checkIn;
    }

    async save(data: CheckIn) {
        const checkIn = await prisma.checkIn.update({
            where: {
                id: data.id
            },
            data
        });

        return checkIn;
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
        const count = await prisma.checkIn.count({
            where: {
                user_id: userId
            }
        });
        return count;
    }

    async findManyByUserId(userId: string, page: number) {
        return [];
    }

    async findByUserIdOnDate(userId: string, date: Date) {
        return null;
    }


}
