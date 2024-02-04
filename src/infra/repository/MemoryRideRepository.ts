import RideRepository from './RideRepository';
import Ride from '../../domain/entity/Ride';
import crypto from 'crypto';
import { nowToISOString } from '../helpers/dates';

export default class MemoryRideRepository implements RideRepository {
  rides: {
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
  }[] = [
    {
      id: '51b08801-abd1-4a11-99a6-33d23c43aa93',
      driverId: '382d8d91-34b8-4118-a294-3c22847f48f5',
      passengerId: '046ba3b6-9425-4a42-8f24-e793462e936a',
      status: 'requested',
      fare: 10,
      distance: 10,
      fromLat: -23.56168,
      fromLong: -46.62543,
      toLat: -23.56168,
      toLong: -46.62543,
      date: nowToISOString()
    }
  ];

  async saveRide(ride: Ride): Promise<Ride> {
    const id = crypto.randomUUID();
    const newRide = Ride.createRide(
      ride.getDriverId(),
      ride.passengerId,
      ride.getStatus(),
      ride.fare,
      ride.distance,
      ride.fromLat,
      ride.fromLong,
      ride.toLat,
      ride.toLong,
      nowToISOString(),
      id
    );
    this.rides.push({
      id,
      driverId: newRide.getDriverId(),
      passengerId: newRide.passengerId,
      status: newRide.getStatus(),
      fare: newRide.fare,
      distance: newRide.distance,
      fromLat: newRide.fromLat,
      fromLong: newRide.fromLong,
      toLat: newRide.toLat,
      toLong: newRide.toLong,
      date: newRide.date
    });
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
    return Ride.createRide(
      rideData.driverId,
      rideData.passengerId,
      rideData.status,
      rideData.fare,
      rideData.distance,
      rideData.fromLat,
      rideData.fromLong,
      rideData.toLat,
      rideData.toLong,
      rideData.date,
      rideData.id
    );
  }

  async findActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined> {
    const rideData = this.rides.find(ride => ride.passengerId === passengerId && ride.status !== 'completed');
    if (!rideData) return undefined;
    return Ride.createRide(
      rideData.driverId,
      rideData.passengerId,
      rideData.status,
      rideData.fare,
      rideData.distance,
      rideData.fromLat,
      rideData.fromLong,
      rideData.toLat,
      rideData.toLong,
      rideData.date,
      rideData.id
    );
  }

  async findRideById(rideId: string): Promise<Ride | undefined> {
    const rideData = this.rides.find(ride => ride.id === rideId);
    if (!rideData) return undefined;
    return Ride.createRide(
      rideData.driverId,
      rideData.passengerId,
      rideData.status,
      rideData.fare,
      rideData.distance,
      rideData.fromLat,
      rideData.fromLong,
      rideData.toLat,
      rideData.toLong,
      rideData.date,
      rideData.id
    );
  }

  async findActiveRideByDriverId(driverId: string): Promise<Ride | undefined> {
    const rideData = this.rides.find(
      ride => ride.driverId === driverId && 
      (ride.status === 'accepted' || ride.status === 'in_progress')
    );
    if (!rideData) return undefined;
    return Ride.createRide(
      rideData.driverId,
      rideData.passengerId,
      rideData.status,
      rideData.fare,
      rideData.distance,
      rideData.fromLat,
      rideData.fromLong,
      rideData.toLat,
      rideData.toLong,
      rideData.date,
      rideData.id
      );
  }
}