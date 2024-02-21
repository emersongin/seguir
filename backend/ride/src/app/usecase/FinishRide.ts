import RideRepository from '../../infra/repository/RideRepository';
import PositionRepository from '../../infra/repository/PositionRepository';

export default class FinishRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly positionRepository: PositionRepository
  ) {}

  async execute(input: InputDto): Promise<void> {
    const { rideId } = input;
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) throw new Error('ride not found');
    const positions = await this.positionRepository.getAllPositionByRideId(rideId);
    const distanceTotal = positions.length > 0 ? ride.calculateDistance(positions) : 0;
    ride.finishRide(distanceTotal);
    await this.rideRepository.update(ride);
  }
}

type InputDto = {
  rideId: string;
};