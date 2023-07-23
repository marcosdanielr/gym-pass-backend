import { it, expect, describe, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('FetchNearby Gyms Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new FetchNearbyGymsUseCase(gymsRepository);
    });

    it('should be able to fetch nearby gyms', async () => {
        await gymsRepository.create({
            title: 'Near Gym',
            description: null,
            phone: null,
            latitude: 35.8113216,
            longitude: -109.6255108
        });
    
        await gymsRepository.create({
            title: 'Far Gym',
            description: null,
            phone: null,
            latitude: 42.443646,
            longitude: -109.7822349
        });

        const { gyms } = await sut.execute({
            userLatitude: 35.8113215,
            userLongitude: -109.6255108
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({title: 'Near Gym'}),
        ]);
    });
});
