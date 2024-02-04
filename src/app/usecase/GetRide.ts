import RideRepository from '../../infra/repository/RideRepository';

export default class GetRide {
  constructor(
    readonly rideRepository: RideRepository
  ) {}

  async execute(input: InputDto): Promise<OutputDto | Error> {
    const { rideId } = input;
    const rideFinded = await this.rideRepository.findRideById(rideId);
    if (!rideFinded) throw new Error("Ride not found.");
    return {
      rideId: rideFinded.id,
      ridePassengerId: rideFinded.ridePassengerId,
      rideDriverId: rideFinded.rideDriverId,
      rideStatus: rideFinded.rideStatus,
      rideFare: rideFinded.rideFare,
      rideDistance: rideFinded.rideDistance,
      rideFromLat: rideFinded.rideFromLat,
      rideFromLong: rideFinded.rideFromLong,
      rideToLat: rideFinded.rideToLat,
      rideToLong: rideFinded.rideToLong,
      rideDate: rideFinded.rideDate,
    };
  }
}

type InputDto = {
  rideId: string;
};

type OutputDto = {
  rideId: string;
  ridePassengerId: string;
  rideDriverId: string;
  rideStatus: string;
  rideFare: number;
  rideDistance: number;
  rideFromLat: number;
  rideFromLong: number;
  rideToLat: number;
  rideToLong: number;
  rideDate: Date;
};