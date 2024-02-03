export default interface RideRepository {
  save(ride: Ride): Promise<Ride>;
  findActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined>;
  findById(rideId: string): Promise<Ride | undefined>;
}