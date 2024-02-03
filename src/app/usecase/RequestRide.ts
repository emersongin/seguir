import RideRepository from '../../infra/repository/RideRepository';
import AccountRepository from '../../infra/repository/AccountRepository';
import Ride from '../../domain/entity/Ride';

export default class RequestRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly accountRepository: AccountRepository
  ) {}
  
  async execute(input: InputDto): Promise<OutputDto | Error> {
    const { passengerId, fromLat, fromLong, toLat, toLong } = input;
    const account = await this.accountRepository.findAccountById(passengerId);
    if (!account) throw new Error('Account not found.'); 
    if (account && !account.isPassenger) throw new Error('Account is not a passenger\'s.');
    const activeRide = await this.rideRepository.findActiveRideByPassengerId(passengerId);
    if (activeRide) throw new Error('Passenger with active ride.');
    const newRideRequested = Ride.createRequest(
      passengerId,
      fromLat,
      fromLong,
      toLat,
      toLong
    );
    const ride = await this.rideRepository.save(newRideRequested);
    return {
      rideId: ride.id
    };
  }
}

export interface InputDto {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
};

export interface OutputDto {
  rideId: string;
};