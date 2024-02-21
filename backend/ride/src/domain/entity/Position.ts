import crypto from 'crypto';
import Coord from '../valueobject/Coord';

export default class Position {
  private coord: Coord;

  private constructor(
    readonly id: string,
    readonly rideId: string,
    lat: number,
    long: number,
    readonly date: Date
  ) {
    this.coord = new Coord(lat, long);
  }

  static create(
    rideId: string,
    lat: number,
    long: number
  ): Position {
    const id = crypto.randomUUID();
    const date = new Date();
    return new Position(id, rideId, lat, long, date);
  }

  static restore(
    id: string,
    rideId: string,
    lat: number,
    long: number,
    date: Date
  ): Position {
    return new Position(id, rideId, lat, long, date);
  }

  getLat(): number {
    return this.coord.getLat();
  }

  getLong(): number {
    return this.coord.getLong();
  }
}