import Coord from '../valueobject/Coord';
import DistanceCalculator from '../service/DistanceCalculator';
import crypto from 'crypto';

export default class Ride {
  private from: Coord;
	private to: Coord;
	private lastPosition: Coord;

  constructor(
    readonly id: string,
    private driverId: string | null,
    readonly passengerId: string,
    private status: string,
    readonly fare: number | null,
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

  static createRide(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
  ): Ride {
    const driverId = null;
    const status = 'requested';
    const fare = null;
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

  static restoreRide(
    id: string,
    driverId: string | null,
    passengerId: string,
    status: string,
    fare: number | null,
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
    if (this.status !== 'in_progress') throw new Error("Ride not in progress");
    const newLastPosition = new Coord(lat, long);
		this.distance += DistanceCalculator.calculate(this.lastPosition, newLastPosition);
		this.lastPosition = newLastPosition;
  }
  
  acceptRide(driverId: string): void {
    this.driverId = driverId;
    this.status = 'accepted';
  }

  startRide(): void {
    this.status = 'in_progress';
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
}