import { it, expect, describe, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ValidateCheckInUseCase } from './validate-check-in';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Validate Check In Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new ValidateCheckInUseCase(checkInsRepository);

        // vi.useFakeTimers();
    });

    // afterEach(() => {
    //     vi.useRealTimers();
    // });

    it('should be able to validate the check-in', async () => {
        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        });

        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id
        });

        expect(checkIn.validated_at).toEqual(expect.any(Date));
        expect(checkInsRepository.checkIns[0].validated_at).toEqual(expect.any(Date));
    });
  
    it('should not be able to validate an inexisting check-in', async () => {
        await expect(() =>
            sut.execute({
                checkInId: 'inexisting-check-in-id'
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
});
