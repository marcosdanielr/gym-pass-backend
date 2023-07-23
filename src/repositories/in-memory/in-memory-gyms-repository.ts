import { Gym, Prisma } from '@prisma/client';
import { GymsRepository } from '../gyms-repository';
import { randomUUID } from 'crypto';

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
