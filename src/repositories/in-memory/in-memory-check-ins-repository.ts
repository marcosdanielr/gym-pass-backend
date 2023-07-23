import { CheckIn, Prisma } from '@prisma/client';
import { CheckInsRepository } from '../check-ins-repository';
import { randomUUID } from 'node:crypto';
import dayjs from 'dayjs';

export class InMemoryCheckInsRepository implements CheckInsRepository {
    public checkIns: CheckIn[] = [];

    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfTheDay = dayjs(date).startOf('date');
        const endOfTheDay = dayjs(date).endOf('date');

        const checkOnSameDate = this.checkIns.find(checkIn => {
            const checkInDate = dayjs(checkIn.created_at);
            const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

            return checkIn.user_id == userId && isOnSameDate;
        });

        if (!checkOnSameDate) {
            return null;
        }

        return checkOnSameDate;
    }

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            validated_at: data.validated_at ? new Date(data.validated_at) : null,
            created_at: new Date()
        };

        this.checkIns.push(checkIn);

        return checkIn;
    }

    async findManyByUserId(userId: string, page: number) {
        return this.checkIns
            .filter(item => item.user_id === userId)
            .slice((page - 1) * 20, page * 20)
        ;
    }

    async countByUserId(userId: string): Promise<number> {
        return this.checkIns.filter(item => item.user_id === userId).length;
    }
}
