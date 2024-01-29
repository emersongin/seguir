export default interface Ride {
  rideId: string;
  driverId: string;
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