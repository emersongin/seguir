import RideRepository from '../../infra/repository/RideRepository';
import AccountRepository from '../../infra/repository/AccountRepository';

export default class AcceptRide {
  constructor(
    readonly rideRepository: RideRepository,
    readonly accountRepository: AccountRepository
  ) {}

  async execute(input: InputDto): Promise<void | Error> {
    const { rideId, driverId } = input;
    const driverAccount = await this.accountRepository.findAccountById(driverId);
    if (!driverAccount) throw new Error('Account not found.'); 
    if (!driverAccount.isDriver) throw new Error('Account is not a driver\'s.');
    const rideToAccept = await this.rideRepository.findRideById(rideId);
    if (!rideToAccept) throw new Error('Ride not found');
    if (rideToAccept.status !== 'requested') throw new Error('Invalid ride to accept.');
    const hasActiveRide = await this.rideRepository.findActiveRideByDriverId(driverId);
    if (hasActiveRide) throw new Error('Ride already accepted or in progress.');
    rideToAccept.acceptDriver(driverId);
    await this.rideRepository.updateRide(rideToAccept);
  }
}

type InputDto = {
  rideId: string;
  driverId: string;
};