import Position from '../../domain/entity/Position';

export default interface PositionRepository {
  save(position: Position): Promise<Position>;
  getAllPositionByRideId(rideId: string): Promise<Position[]>;
}