import RideRepository from '../../infra/repository/RideRepository';
import Position from '../../domain/entity/Position';
import PositionRepository from '../../infra/repository/PositionRepository';

export default class UpdatePosition {
  constructor(
    readonly rideRepository: RideRepository,
    readonly positionRepository: PositionRepository
  ) {}
  
  async execute(input: InputDto): Promise<void | Error>{
    const { rideId, latPosition, longPosition } = input;
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) throw new Error("Ride not found");
    ride.updatePosition(latPosition, longPosition);
    await this.rideRepository.update(ride);
    const position = Position.create(rideId, latPosition, longPosition);
    await this.positionRepository.save(position);
  }
}

type InputDto = { 
  rideId: string;
  latPosition: number; 
  longPosition: number; 
}