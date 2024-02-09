import Ride from '../../domain/entity/Ride';

export default interface RideRepository {
  save(ride: Ride): Promise<Ride>;
  update(ride: Ride): Promise<Ride>;
  getActiveByPassengerId(passengerId: string): Promise<Ride | undefined>;
  getById(rideId: string): Promise<Ride | undefined>;
  getActiveByDriverId(driverId: string): Promise<Ride | undefined>;
}