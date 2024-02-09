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
    const account = await this.accountRepository.getById(passengerId);
    if (!account) throw new Error('Account not found.'); 
    if (!account.isPassenger) throw new Error('Account is not a passenger\'s.');
    const activeRide = await this.rideRepository.getActiveByPassengerId(passengerId);
    if (activeRide) throw new Error('Passenger with active ride.');
    const newRideRequested = Ride.createRide(
      passengerId,
      fromLat,
      fromLong,
      toLat,
      toLong
    );
    const ride = await this.rideRepository.save(newRideRequested);
    // fazer teste de erro
    if (!ride.id) throw new Error('Ride not created.');
    return {
      rideId: ride.id
    };
  }
}

type InputDto = {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
};

type OutputDto = {
  rideId: string;
};