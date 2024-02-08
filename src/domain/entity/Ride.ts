import crypto from 'crypto';

export default class Ride {
  constructor(
    readonly id: string,
    private driverId: string | null,
    readonly passengerId: string,
    private status: string,
    readonly fare: number | null,
    readonly distance: number | null,
    readonly fromLat: number,
    readonly fromLong: number,
    readonly toLat: number,
    readonly toLong: number,
    readonly date: Date
  ) {}

  static createRide(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
  ): Ride {
    return new Ride(
      crypto.randomUUID(),
      null,
      passengerId,
      'requested',
      null,
      null,
      fromLat,
      fromLong,
      toLat,
      toLong,
      new Date()
    );
  }

  static restoreRide(
    id: string,
    driverId: string | null,
    passengerId: string,
    status: string,
    fare: number | null,
    distance: number | null,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
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
      date
    );
  }
  
  acceptDriver(driverId: string): void {
    this.driverId = driverId;
    this.status = 'accepted';
  }

  startRide(): void {
    this.status = 'in_progress';
  }

  getRideId(): string {
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
}