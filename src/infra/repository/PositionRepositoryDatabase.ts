import PositionRepository from './PositionRepository';
import SQLDataBaseGateway from '../gateway/SQLDataBaseGateway';
import Position from '../../domain/entity/Position';

export default class PositionRepositoryDatabase implements PositionRepository {
  constructor(
    readonly database: SQLDataBaseGateway
  ) {}

  async save(position: Position): Promise<Position> {
    await this.database.query(
      'INSERT INTO position (position_id, ride_id, lat, long, date) VALUES ($1, $2, $3, $4, $5)',
      [position.id, position.rideId, position.getLat(), position.getLong(), position.date]
    );
    return position;
  }

  async getAllByRideId(rideId: string): Promise<Position[]> {
    const positionsData = await this.database.query('SELECT * FROM position WHERE ride_id = $1', [rideId]);
    return positionsData.map((positionData: positionData) => Position.restore(
      positionData.position_id,
      positionData.ride_id,
      positionData.lat,
      positionData.long,
      positionData.date
    ));
  }
}

type positionData = {
  position_id: string;
  ride_id: string;
  lat: number;
  long: number;
  date: Date;
}