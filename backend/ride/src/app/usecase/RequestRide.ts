import RideRepository from '../../infra/repository/RideRepository';
import AccountGateway from '../../infra/gateway/AccountGateway';
import Ride from '../../domain/entity/Ride';

export default class RequestRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly accountGateway: AccountGateway
  ) {}
  
  async execute(input: InputDto): Promise<OutputDto> {
    const { passengerId, fromLat, fromLong, toLat, toLong } = input;
    const account = await this.accountGateway.getById(passengerId);
    if (!account) throw new Error('Account not found.'); 
    if (!account.isPassenger) throw new Error('Account is not a passenger\'s.');
    const activeRide = await this.rideRepository.getActiveRideByPassengerId(passengerId);
    if (activeRide) throw new Error('Passenger with active ride.');
    const newRideRequested = Ride.create(
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