import RideRepository from './RideRepository';
import Ride from '../../domain/entity/Ride';
import crypto from 'crypto';
import { nowToISOString } from '../helpers/dates';

export default class RideRepositoryPGP implements RideRepository {
  constructor(
    private _connection: any
  ) {}

  async saveRide(ride: Ride): Promise<Ride> {
    const id = crypto.randomUUID();
    await this._connection.query(
      'INSERT INTO ride (ride_id, driver_id, passenger_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      [
        id,
        ride.getDriverId(),
        ride.passengerId,
        ride.getStatus(),
        ride.fare,
        ride.distance,
        ride.fromLat,
        ride.fromLong,
        ride.toLat,
        ride.toLong,
        ride.getDate()
      ]
    );
    const newRide = Ride.restoreRide(
      id,
      ride.getDriverId(),
      ride.passengerId,
      ride.getStatus(),
      ride.fare,
      ride.distance,
      ride.fromLat,
      ride.fromLong,
      ride.toLat,
      ride.toLong,
      ride.getDate()
    );
    return newRide;
  }

  async updateRide(ride: Ride): Promise<Ride> {
    await this._connection.query(
      `UPDATE ride 
        SET 
          driver_id = $1, 
          passenger_id = $2, 
          status = $3, 
          fare = $4, 
          distance = $5, 
          from_lat = $6, 
          from_long = $7, 
          to_lat = $8, 
          to_long = $9, 
          date = $10 
        WHERE 
          ride_id = $11`,
      [
        ride.getDriverId(),
        ride.passengerId,
        ride.getStatus(),
        ride.fare,
        ride.distance,
        ride.fromLat,
        ride.fromLong,
        ride.toLat,
        ride.toLong,
        ride.getDate(),
        ride.id
      ]
    );
    return ride;
  }

  async findActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined> {
    const [rideData] = await this._connection.query(
      'SELECT * FROM ride WHERE passenger_id = $1 AND (status = $2 OR status = $3)',
      [passengerId, 'accepted', 'in_progress']
    );
    if (!rideData) return;
    return Ride.restoreRide(
      rideData.ride_id,
      rideData.driver_id,
      rideData.passenger_id,
      rideData.status,
      rideData.fare,
      rideData.distance,
      rideData.from_lat,
      rideData.from_long,
      rideData.to_lat,
      rideData.to_long,
      rideData.date
    );
  }

  async findRideById(rideId: string): Promise<Ride | undefined> {
    const [rideData] = await this._connection.query('SELECT * FROM ride WHERE ride_id = $1', [rideId]);
    if (!rideData) return;
    return Ride.restoreRide(
      rideData.ride_id,
      rideData.driver_id,
      rideData.passenger_id,
      rideData.status,
      rideData.fare,
      rideData.distance,
      rideData.from_lat,
      rideData.from_long,
      rideData.to_lat,
      rideData.to_long,
      rideData.date
    );
  }

  async findActiveRideByDriverId(driverId: string): Promise<Ride | undefined> {
    const [rideData] = await this._connection.query(
      'SELECT * FROM ride WHERE driver_id = $1 AND (status = $2 OR status = $3)',
      [driverId, 'accepted', 'in_progress']
    );
    if (!rideData) return;
    return Ride.restoreRide(
      rideData.ride_id,
      rideData.driver_id,
      rideData.passenger_id,
      rideData.status,
      rideData.fare,
      rideData.distance,
      rideData.from_lat,
      rideData.from_long,
      rideData.to_lat,
      rideData.to_long,
      rideData.date
    );
  }
}

type RideData = {
  id: string;
  driverId: string | null;
  passengerId: string;
  status: string;
  fare: number | null;
  distance: number | null;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  date: Date;
};