import { nowToISOString } from '../../infra/helpers/dates';

export default class Ride {
  constructor(
    readonly id: string | null,
    readonly driverId: string | null,
    readonly passengerId: string,
    readonly status: string,
    readonly fare: number | null,
    readonly distance: number | null,
    readonly fromLat: number,
    readonly fromLong: number,
    readonly toLat: number,
    readonly toLong: number,
    readonly date: string
  ) {}

  static createRequest(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
  ): Ride {
    return new Ride(
      null,
      null,
      passengerId,
      'requested',
      null,
      null,
      fromLat,
      fromLong,
      toLat,
      toLong,
      nowToISOString()
    );
  }

  static createRideWithId(
    rideId: string,
    driverId: string | null,
    passengerId: string,
    status: string,
    fare: number | null,
    distance: number | null,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    date: string
  ): Ride {
    return new Ride(
      rideId,
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

}