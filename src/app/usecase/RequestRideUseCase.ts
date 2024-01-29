import InputRequestRide from '../dto/request-ride/input';
import OutputRequestRide from '../dto/request-ride/output';
import AccountDAO from '../../domain/dao/AccountDAO';
import { nowToISOString } from '../../infra/helpers/dates';
import RideDAO from '../../domain/dao/RideDAO';

export default class RequestRideUseCase {
  constructor(
    private readonly accountDao: AccountDAO,
    private readonly rideDao: RideDAO
  ) {}
  
  async execute(input: InputRequestRide): Promise<OutputRequestRide | Error> {
    const account = await this.accountDao.findAccountById(input.passengerId);
    if (!account || !account.isPassenger) throw new Error('invalid passenger id.'); 
    const requestRide = {
      passengerId: input.passengerId,
      status: 'requested',
      fromLat: input.fromLat,
      fromLong: input.fromLong,
      toLat: input.toLat,
      toLong: input.toLong,
      date: nowToISOString(),
    };
    const ride = await this.rideDao.createRide(requestRide);
    return {
      rideId: ride.rideId
    };
  }
}