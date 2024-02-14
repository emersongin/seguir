import RideRepository from './RideRepository';
import Ride from '../../domain/entity/Ride';

export default class RideRepositoryMemory implements RideRepository {
  private rides: RideData[] = [];

  async save(ride: Ride): Promise<Ride> {
    this.rides.push({
      id: ride.getId(),
      driverId: ride.getDriverId(),
      passengerId: ride.passengerId,
      status: ride.getStatus(),
      fare: ride.fare,
      distance: ride.getDistance(),
      fromLat: ride.getFromLat(),
      fromLong: ride.getFromLong(),
      toLat: ride.getToLat(),
      toLong: ride.getToLong(),
      lastLat: ride.getLastLat(),
      lastLong: ride.getLastLong(),
      date: ride.getDate()
    });
    const newRide = Ride.restore(
      ride.getId(),
      ride.getDriverId(),
      ride.passengerId,
      ride.getStatus(),
      ride.fare,
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
    const rideData = this.rides.find(r => r.id === ride.id);
    if (!rideData) throw new Error('Ride not found.');
    rideData.driverId = ride.getDriverId();
    rideData.passengerId = ride.passengerId;
    rideData.status = ride.getStatus();
    rideData.fare = ride.fare;
    rideData.distance = ride.getDistance();
    rideData.fromLat = ride.getFromLat();
    rideData.fromLong = ride.getFromLong();
    rideData.toLat = ride.getToLat();
    rideData.toLong = ride.getToLong();
    rideData.date = ride.getDate();
    return Ride.restore(
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
      rideData.lastLat,
      rideData.lastLong,
      rideData.date
    );
  }

  async getActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined> {
    const rideData = this.rides.find(ride => ride.passengerId === passengerId && ride.status !== 'completed');
    if (!rideData) return undefined;
    return Ride.restore(
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
      rideData.lastLat,
      rideData.lastLong,
      rideData.date
    );
  }

  async getById(rideId: string): Promise<Ride | undefined> {
    const rideData = this.rides.find(ride => ride.id === rideId);
    if (!rideData) return undefined;
    return Ride.restore(
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
      rideData.lastLat,
      rideData.lastLong,
      rideData.date
    );
  }

  async getActiveRideByDriverId(driverId: string): Promise<Ride | undefined> {
    const rideData = this.rides.find(
      ride => ride.driverId === driverId && 
      (ride.status === 'accepted' || ride.status === 'in_progress')
    );
    if (!rideData) return undefined;
    return Ride.restore(
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
      rideData.lastLat,
      rideData.lastLong,
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
  distance: number;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  lastLat: number;
  lastLong: number;
  date: Date;
};