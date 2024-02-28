import RideRepository from './RideRepository';
import Ride from '../../domain/entity/Ride';
import crypto from 'crypto';
import DatabaseConnection from '../database/DatabaseConnection';

export default class RideRepositoryDatabase implements RideRepository {
  constructor(
    private database: DatabaseConnection
  ) {}

  async save(ride: Ride): Promise<Ride> {
    await this.database.query(
      'INSERT INTO ride (ride_id, driver_id, passenger_id, status, fare, distance, from_lat, from_long, to_lat, to_long, last_lat, last_long, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
      [
        ride.getId(),
        ride.getDriverId(),
        ride.passengerId,
        ride.getStatus(),
        ride.getFare(),
        ride.getDistance(),
        ride.getFromLat(),
        ride.getFromLong(),
        ride.getToLat(),
        ride.getToLong(),
        ride.getLastLat(),
        ride.getLastLong(),
        ride.getDate()
      ]
    );
    const newRide = Ride.restore(
      ride.getId(),
      ride.getDriverId(),
      ride.passengerId,
      ride.getStatus(),
      ride.getFare(),
      ride.getDistance(),
      ride.getFromLat(),
      ride.getFromLong(),
      ride.getToLat(),
      ride.getToLong(),
      ride.getLastLat(),
      ride.getLastLong(),
      ride.getDate()
    );
    return newRide;
  }

  async update(ride: Ride): Promise<Ride> {
    await this.database.query(
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
          last_lat = $10,
          last_long = $11,
          date = $12 
        WHERE 
          ride_id = $13`,
      [
        ride.getDriverId(),
        ride.passengerId,
        ride.getStatus(),
        ride.getFare(),
        ride.getDistance(),
        ride.getFromLat(),
        ride.getFromLong(),
        ride.getToLat(),
        ride.getToLong(),
        ride.getLastLat(),
        ride.getLastLong(),
        ride.getDate(),
        ride.getId()
      ]
    );
    return ride;
  }

  async getActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined> {
    const [rideData] = await this.database.query(
      'SELECT * FROM ride WHERE passenger_id = $1 AND (status = $2 OR status = $3)',
      [passengerId, 'accepted', 'in_progress']
    );
    if (!rideData) return;
    return Ride.restore(
      rideData.ride_id,
      rideData.driver_id,
      rideData.passenger_id,
      rideData.status,
      parseFloat(rideData.fare),
      parseFloat(rideData.distance),
      parseFloat(rideData.from_lat),
      parseFloat(rideData.from_long),
      parseFloat(rideData.to_lat),
      parseFloat(rideData.to_long),
      parseFloat(rideData.last_lat),
      parseFloat(rideData.last_long),
      rideData.date
    );
  }

  async getById(rideId: string): Promise<Ride | undefined> {
    const [rideData] = await this.database.query('SELECT * FROM ride WHERE ride_id = $1', [rideId]);
    if (!rideData) return;
    return Ride.restore(
      rideData.ride_id,
      rideData.driver_id,
      rideData.passenger_id,
      rideData.status,
      parseFloat(rideData.fare),
      parseFloat(rideData.distance),
      parseFloat(rideData.from_lat),
      parseFloat(rideData.from_long),
      parseFloat(rideData.to_lat),
      parseFloat(rideData.to_long),
      parseFloat(rideData.last_lat),
      parseFloat(rideData.last_long),
      rideData.date
    );
  }

  async getActiveRideByDriverId(driverId: string): Promise<Ride | undefined> {
    const [rideData] = await this.database.query(
      'SELECT * FROM ride WHERE driver_id = $1 AND (status = $2 OR status = $3)',
      [driverId, 'accepted', 'in_progress']
    );
    if (!rideData) return;
    return Ride.restore(
      rideData.ride_id,
      rideData.driver_id,
      rideData.passenger_id,
      rideData.status,
      parseFloat(rideData.fare),
      parseFloat(rideData.distance),
      parseFloat(rideData.from_lat),
      parseFloat(rideData.from_long),
      parseFloat(rideData.to_lat),
      parseFloat(rideData.to_long),
      parseFloat(rideData.last_lat),
      parseFloat(rideData.last_long),
      rideData.date
    );
  }
}

type RideData = {
  id: string;
  driverId: string | null;
  passengerId: string;
  status: string;
  fare: number;
  distance: number;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  date: Date;
};