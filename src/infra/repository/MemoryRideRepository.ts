import RideRepository from './RideRepository';
import Ride from '../../domain/entity/Ride';
import crypto from 'crypto';
import { nowToISOString } from '../helpers/dates';

export default class MemoryRideRepository implements RideRepository {
  private rides: Ride[] = [
    new Ride(
      '1',
      '382d8d91-34b8-4118-a294-3c22847f48f5',
      '046ba3b6-9425-4a42-8f24-e793462e936a',
      'requested',
      10,
      10,
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543,
      nowToISOString()
    ),
  ];

  async save(ride: Ride): Promise<Ride> {
    const id = crypto.randomUUID();
    const newRide = Ride.createRideWithId(
      id,
      ride.driverId,
      ride.passengerId,
      ride.status,
      ride.fare,
      ride.distance,
      ride.fromLat,
      ride.fromLong,
      ride.toLat,
      ride.toLong,
      nowToISOString()
    );
    this.rides.push(newRide);
    return ride;
  }

  async findActiveRideByPassengerId(passengerId: string): Promise<Ride | null> {
    const ride = this.rides.find(ride => ride.passengerId === passengerId && ride.status !== 'completed');
    return ride || null;
  }
}