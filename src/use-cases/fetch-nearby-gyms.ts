import { GymsRepository } from '@/repositories/gyms-repository';
import { Gym } from '@prisma/client';

interface FeatchNearbyGymsUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
}

interface FeatchNearbyGymsUseCaseResponse {
  gyms: Gym[];
}

export class FeatchNearbyGymsUseCase {
    constructor(private gymsRepository: GymsRepository) {}

    async execute({
        userLatitude,
        userLongitude
    }: FeatchNearbyGymsUseCaseRequest): Promise<FeatchNearbyGymsUseCaseResponse> {

        const gyms = await this.gymsRepository.findManyNearby({
            latitude: userLatitude,
            longitude: userLongitude
        });

        return {
            gyms
        };
    }
}
