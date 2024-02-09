import RideRepository from '../../infra/repository/RideRepository';

export default class UpdatePosition {
  constructor(
    readonly rideRepository: RideRepository
  ) {}
  
  async execute(input: InputDto): Promise<void | Error>{
    const { rideId, latPosition, longPosition } = input;
    const ride = await this.rideRepository.findRideById(rideId);
    if (!ride) throw new Error("Ride not found");
    ride.updatePosition(latPosition, longPosition);
    await this.rideRepository.updateRide(ride);
  }
}

type InputDto = { 
  rideId: string;
  latPosition: number; 
  longPosition: number; 
}