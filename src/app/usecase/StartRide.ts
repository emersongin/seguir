import RideRepository from '../../infra/repository/RideRepository';
import AccountRepository from '../../infra/repository/AccountRepository';

export default class StartRide {
  constructor(
    readonly rideRepository: RideRepository, 
    readonly accountRepository: AccountRepository
  ) {}

  async execute(input: InputDto): Promise<void> {
    const { rideId } = input;
    const ride = await this.rideRepository.findRideById(rideId);
    if (!ride) throw new Error('Ride not found.');
    if (ride.status !== 'accepted') throw new Error('Ride already started.');
    ride.startRide();
  }
}

type InputDto = {
  rideId: string;
};