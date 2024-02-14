import RideRepository from '../../infra/repository/RideRepository';
import AccountRepository from '../../infra/repository/AccountRepository';

export default class StartRide {
  constructor(
    private readonly rideRepository: RideRepository, 
    private readonly accountRepository: AccountRepository
  ) {}

  async execute(input: InputDto): Promise<void> {
    const { rideId } = input;
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) throw new Error('Ride not found.');
    ride.startRide();
  }
}

type InputDto = {
  rideId: string;
};