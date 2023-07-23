import { it, expect, describe, beforeEach } from 'vitest';
import { SearchGymsUseCase } from './search-gyms';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new SearchGymsUseCase(gymsRepository);
    });

    it('should be able to search for gyms', async () => {
        await gymsRepository.create({
            title: 'Academia do Ratão',
            description: null,
            phone: null,
            latitude: 35.8113216,
            longitude: -109.6255108
        });
    
        await gymsRepository.create({
            title: 'Academia do Amarelão',
            description: null,
            phone: null,
            latitude: 35.8113216,
            longitude: -109.6255108
        });

        const { gyms } = await sut.execute({
            query: 'Amarelão',
            page: 1
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({title: 'Academia do Amarelão'}),
        ]);
    });


    it.skip('should be able to fetch paginated gym search', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `Academia do Amarelão ${i}`,
                description: null,
                phone: null,
                latitude: 35.8113216,
                longitude: -109.6255108
            });
        }

        const { gyms } = await sut.execute({
            query: 'Academia do Amarelão',
            page: 2
        });

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({title: 'Academia do Amarelão 21'}),
            expect.objectContaining({title: 'Academia do Amarelão 22'}),
        ]);
    });
});
