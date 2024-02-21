import RideRepository from '../../infra/repository/RideRepository';
import AccountGateway from '../../infra/gateway/AccountGateway';

export default class StartRide {
  constructor(
    private readonly rideRepository: RideRepository
  ) {}

  async execute(input: InputDto): Promise<void> {
    const { rideId } = input;
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) throw new Error('Ride not found.');
    ride.startRide();
    await this.rideRepository.update(ride);
  }
}

type InputDto = {
  rideId: string;
};