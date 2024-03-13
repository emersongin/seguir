import Coord from '../valueobject/Coord';
import DistanceCalculator from '../service/DistanceCalculator';
import crypto from 'crypto';
import Position from './Position';
import { FareCalculatorFactory } from '../service/FareCalculator';

export default class Ride {
  private from: Coord;
	private to: Coord;
	private lastPosition: Coord;

  constructor(
    readonly id: string,
    private driverId: string | null,
    readonly passengerId: string,
    private status: string,
    private fare: number,
    private distance: number,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    lastLat: number,
    lastLong: number,
    readonly date: Date
  ) {
    this.from = new Coord(fromLat, fromLong);
		this.to = new Coord(toLat, toLong);
		this.lastPosition = new Coord(lastLat, lastLong);
  }

  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
  ): Ride {
    const driverId = null;
    const status = 'requested';
    const fare = 0;
    const distance = 0;
    return new Ride(
      crypto.randomUUID(),
      driverId,
      passengerId,
      status,
      fare,
      distance,
      fromLat,
      fromLong,
      toLat,
      toLong,
      fromLat,
      fromLong,
      new Date()
    );
  }

  static restore(
    id: string,
    driverId: string | null,
    passengerId: string,
    status: string,
    fare: number,
    distance: number,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    lastLat: number,
    lastLong: number,
    date: Date
  ): Ride {
    return new Ride(
      id,
      driverId,
      passengerId,
      status,
      fare,
      distance,
      fromLat,
      fromLong,
      toLat,
      toLong,
      lastLat,
      lastLong,
      date
    );
  }

  updatePosition(lat: number, long: number): void {
    if (this.status !== 'in_progress') throw new Error("Ride is not in progress.");
    const newLastPosition = new Coord(lat, long);
		this.distance += DistanceCalculator.calculate(this.lastPosition, newLastPosition);
		this.lastPosition = newLastPosition;
  }

  calculateDistance(positions: Position[]): number {
    return positions.reduce((total, position, index) => {
      if (index === 0) return total;
      const lastPosition = positions[index - 1];
      return total + DistanceCalculator.calculate(
        new Coord(lastPosition.getLat(), lastPosition.getLong()),
        new Coord(position.getLat(), position.getLong())
      );
    }, 0);
  }
  
  acceptRide(driverId: string): void {
    if (this.status !== 'requested') throw new Error('Invalid ride to accept.');
    this.driverId = driverId;
    this.status = 'accepted';
  }

  startRide(): void {
    if (this.status !== 'accepted') throw new Error('Ride already started.');
    this.status = 'in_progress';
  }

  finishRide(distance: number): void {
    if (this.status !== 'in_progress') throw new Error('Ride is not in progress.');
    this.distance = distance;
    this.fare = FareCalculatorFactory.create(this.date).calculate(this.distance);
    this.status = 'completed';
  }

  getId(): string {
    return this.id;
  }

  getDriverId(): string | null {
    return this.driverId;
  }

  getStatus(): string {
    return this.status;
  }

  getDate(): Date {
    return this.date;
  }

  getFromLat(): number {
    return this.from.getLat();
  }

  getFromLong(): number {
    return this.from.getLong();
  }

  getToLat(): number {
    return this.to.getLat();
  }

  getToLong(): number {
    return this.to.getLong();
  }

  getLastLat(): number {
    return this.lastPosition.getLat();
  }

  getLastLong(): number {
    return this.lastPosition.getLong();
  }

  getDistance(): number {
    return this.distance;
  }

  getFare(): number {
    return this.fare;
  }
}