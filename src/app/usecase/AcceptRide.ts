import RideRepository from '../../infra/repository/RideRepository';
import AccountRepository from '../../infra/repository/AccountRepository';

export default class AcceptRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly accountRepository: AccountRepository
  ) {}

  async execute(input: InputDto): Promise<void> {
    const { rideId, driverId } = input;
    const driverAccount = await this.accountRepository.getById(driverId);
    if (!driverAccount) throw new Error('Account not found.'); 
    if (!driverAccount.isDriver) throw new Error('Account is not a driver\'s.');
    const rideToAccept = await this.rideRepository.getById(rideId);
    if (!rideToAccept) throw new Error('Ride not found');
    rideToAccept.acceptRide(driverId);
    const hasActiveRide = await this.rideRepository.getActiveRideByDriverId(driverId);
    if (hasActiveRide) throw new Error('Ride already accepted or in progress.');
    await this.rideRepository.update(rideToAccept);
  }
}

type InputDto = {
  rideId: string;
  driverId: string;
};