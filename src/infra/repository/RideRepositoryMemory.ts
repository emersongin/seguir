import RideRepository from './RideRepository';
import Ride from '../../domain/entity/Ride';
import crypto from 'crypto';
import { nowToISOString } from '../helpers/dates';

export default class RideRepositoryMemory implements RideRepository {
  private rides: RideData[] = [];

  async saveRide(ride: Ride): Promise<Ride> {
    const id = crypto.randomUUID();
    this.rides.push({
      id,
      driverId: ride.getDriverId(),
      passengerId: ride.passengerId,
      status: ride.getStatus(),
      fare: ride.fare,
      distance: ride.distance,
      fromLat: ride.fromLat,
      fromLong: ride.fromLong,
      toLat: ride.toLat,
      toLong: ride.toLong,
      date: ride.date
    });
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
      ride.date
    );
    return newRide;
  }

  async updateRide(ride: Ride): Promise<Ride> {
    const rideData = this.rides.find(r => r.id === ride.id);
    if (!rideData) throw new Error('Ride not found.');
    rideData.driverId = ride.getDriverId();
    rideData.passengerId = ride.passengerId;
    rideData.status = ride.getStatus();
    rideData.fare = ride.fare;
    rideData.distance = ride.distance;
    rideData.fromLat = ride.fromLat;
    rideData.fromLong = ride.fromLong;
    rideData.toLat = ride.toLat;
    rideData.toLong = ride.toLong;
    rideData.date = ride.date;
    return Ride.restoreRide(
      rideData.id,
      rideData.driverId,
      rideData.passengerId,
      rideData.status,
      rideData.fare,
      rideData.distance,
      rideData.fromLat,
      rideData.fromLong,
      rideData.toLat,
      rideData.toLong,
      rideData.date
    );
  }

  async findActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined> {
    const rideData = this.rides.find(ride => ride.passengerId === passengerId && ride.status !== 'completed');
    if (!rideData) return undefined;
    return Ride.restoreRide(
      rideData.id,
      rideData.driverId,
      rideData.passengerId,
      rideData.status,
      rideData.fare,
      rideData.distance,
      rideData.fromLat,
      rideData.fromLong,
      rideData.toLat,
      rideData.toLong,
      rideData.date
    );
  }

  async findRideById(rideId: string): Promise<Ride | undefined> {
    const rideData = this.rides.find(ride => ride.id === rideId);
    if (!rideData) return undefined;
    return Ride.restoreRide(
      rideData.id,
      rideData.driverId,
      rideData.passengerId,
      rideData.status,
      rideData.fare,
      rideData.distance,
      rideData.fromLat,
      rideData.fromLong,
      rideData.toLat,
      rideData.toLong,
      rideData.date
    );
  }

  async findActiveRideByDriverId(driverId: string): Promise<Ride | undefined> {
    const rideData = this.rides.find(
      ride => ride.driverId === driverId && 
      (ride.status === 'accepted' || ride.status === 'in_progress')
    );
    if (!rideData) return undefined;
    return Ride.restoreRide(
      rideData.id,
      rideData.driverId,
      rideData.passengerId,
      rideData.status,
      rideData.fare,
      rideData.distance,
      rideData.fromLat,
      rideData.fromLong,
      rideData.toLat,
      rideData.toLong,
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
  date: string;
};