import Ride from '../../domain/entity/Ride';

export default interface RideRepository {
  save(ride: Ride): Promise<Ride>;
  update(ride: Ride): Promise<Ride>;
  getActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined>;
  getById(rideId: string): Promise<Ride | undefined>;
  getActiveRideByDriverId(driverId: string): Promise<Ride | undefined>;
}