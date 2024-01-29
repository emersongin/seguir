import RideDAO, { requestRide } from '../../domain/dao/RideDAO';
import Ride from '../../domain/entity/Ride';
import crypto from 'crypto';

export default class MemoryRideDAO implements RideDAO {
  _rides = [
    {
      rideId: 'ride-1',
      driverId: 'driver-1',
      passengerId: 'passenger-1',
      status: 'requested',
      fare: 0,
      distance: 0,
      fromLat: -23.56168,
      fromLong: -46.62543,
      toLat: -23.56168,
      toLong: -46.62543,
      date: new Date('2021-01-01T00:00:00.000Z'),
    },
    {
      rideId: 'ride-2',
      driverId: 'driver-2',
      passengerId: 'passenger-2',
      status: 'requested',
      fare: 0,
      distance: 0,
      fromLat: -23.56168,
      fromLong: -46.62543,
      toLat: -23.56168,
      toLong: -46.62543,
      date: new Date('2021-01-01T00:00:00.000Z'),
    },
    {
      rideId: 'ride-3',
      driverId: 'driver-3',
      passengerId: 'passenger-3',
      status: 'requested',
      fare: 0,
      distance: 0,
      fromLat: -23.56168,
      fromLong: -46.62543,
      toLat: -23.56168,
      toLong: -46.62543,
      date: new Date('2021-01-01T00:00:00.000Z'),
    }
  ];

  async createRide(input: requestRide): Promise<Ride> {
    const id = crypto.randomUUID();
      const ride = {
          rideId: id,
          driverId: '',
          passengerId: input.passengerId,
          status: input.status,
          fare: 0,
          distance: 0,
          fromLat: input.fromLat,
          fromLong: input.fromLong,
          toLat: input.toLat,
          toLong: input.toLong,
          date: new Date(input.date),
      };
      this._rides.push(ride);
      return ride;
  }
};