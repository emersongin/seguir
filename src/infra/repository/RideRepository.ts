import Ride from '../../domain/entity/Ride';

export default interface RideRepository {
  saveRide(ride: Ride): Promise<Ride>;
  updateRide(ride: Ride): Promise<Ride>;
  findActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined>;
  findRideById(rideId: string): Promise<Ride | undefined>;
  findActiveRideByDriverId(driverId: string): Promise<Ride | undefined>;
}