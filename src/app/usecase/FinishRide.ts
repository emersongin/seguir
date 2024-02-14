import RideRepository from '../../infra/repository/RideRepository';

export default class FinishRide {
  constructor(
    private readonly rideRepository: RideRepository
  ) {}

  async execute(input: InputDto): Promise<void> {
    const { rideId } = input;
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) throw new Error('ride not found');
    ride.finishRide();
    await this.rideRepository.save(ride);
  }
}

type InputDto = {
  rideId: string;
};