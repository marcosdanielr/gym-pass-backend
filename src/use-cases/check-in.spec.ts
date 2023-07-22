import { it, expect, describe, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check In Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInUseCase(checkInsRepository, gymsRepository);
    
        gymsRepository.gyms.push({
            id: 'gym-01',
            title: 'Coliseu',
            phone: '445458745',
            description: 'aaaa',
            latitude: new Decimal(0),
            longitude: new Decimal(0)
        });

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to check in', async () => {

        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });
  
    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        });

        await expect(() => sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        })).rejects.toBeInstanceOf(Error);
    });
  
    it('should be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        });

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

        const { checkIn} = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });
  
    it('should not be able to check in on distant gym', async () => {
        gymsRepository.gyms.push({
            id: 'gym-02',
            title: 'Coliseu',
            phone: '445458745',
            description: 'aaaa',
            latitude: new Decimal(35.8113216),
            longitude: new Decimal(-109.6255108)
        });

        await expect(() =>
            sut.execute({
                gymId: 'gym-02',
                userId: 'user-01',
                userLatitude: 35.8113216,
                userLongitude: -109.0255108
            })
        ).rejects.toBeInstanceOf(Error);
    });
});
