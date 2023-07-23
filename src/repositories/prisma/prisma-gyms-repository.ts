import { Prisma } from '@prisma/client';
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';
import { prisma } from '@/lib/prisma';

export class PrismaGymsRepository implements GymsRepository {
    async create(data: Prisma.GymCreateInput) {
        const gym = await prisma.gym.create({
            data
        });

        return gym;      
    }

    async findById(id: string){
        const gym = await prisma.gym.findUnique({
            where: {
                id
            }
        });

        return gym;      
    }

    async searchMany(query: string, page: number) {
      
    }

    async findManyNearby(params: FindManyNearbyParams) {
      
    }
}
