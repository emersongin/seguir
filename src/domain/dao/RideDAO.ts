import Ride from "../../domain/entity/Ride";

export interface requestRide {
  passengerId: string;
  status: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  date: string;
};

export default interface RideDAO {
  createRide(input: requestRide): Promise<Ride>;
};