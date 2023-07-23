import { Gym, Prisma } from '@prisma/client';
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';
import { randomUUID } from 'crypto';
import { getDistanceBetweenCordinates } from '@/utils/get-distance-between-coordinates';

export class InMemoryGymsRepository implements GymsRepository {
    public gyms: Gym[] = [];

    async findById(id: string) {
        const gym = this.gyms.find((gym) => gym.id === id);

        if (!gym) {
            return null;
        }

        return gym;
    }

    async searchMany(query: string, page: number) {
        return this.gyms
            .filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
            .slice((page - 1) * 20, page * 20);
    }

    async findManyNearby(params: FindManyNearbyParams) {
        return this.gyms.filter(item => {
            const MAX_DISTANCE_IN_KILOMETERS = 10;
      
            const distance = getDistanceBetweenCordinates(
                {latitude: params.latitude, longitude: params.longitude},
                {latitude: item.latitude.toNumber(), longitude: item.longitude.toNumber()}
            );

            return distance < MAX_DISTANCE_IN_KILOMETERS;
        });      
    }

    async create(data: Prisma.GymCreateInput) {
        const gym = {
            id: data.id ?? randomUUID(),
            title: data.title,
            description: data.description ?? null,
            phone: data.phone ?? null,
            latitude: new Prisma.Decimal(data.latitude.toString()),
            longitude: new Prisma.Decimal(data.longitude.toString()),
            created_at: new Date()
        };

        this.gyms.push(gym);

        return gym;
    }
}
