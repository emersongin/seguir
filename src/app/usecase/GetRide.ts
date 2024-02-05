import RideRepository from '../../infra/repository/RideRepository';

export default class GetRide {
  constructor(
    private readonly rideRepository: RideRepository
  ) {}

  async execute(input: InputDto): Promise<OutputDto | Error> {
    const { rideId } = input;
    const rideFinded = await this.rideRepository.findRideById(rideId);
    if (!rideFinded || !rideFinded.id || !rideFinded.passengerId) throw new Error("Ride not found.");
    return {
      rideId: rideFinded.id,
      ridePassengerId: rideFinded.passengerId,
      rideDriverId: rideFinded.getDriverId(),
      rideStatus: rideFinded.getStatus(),
      rideFare: rideFinded.fare,
      rideDistance: rideFinded.distance,
      rideFromLat: rideFinded.fromLat,
      rideFromLong: rideFinded.fromLong,
      rideToLat: rideFinded.toLat,
      rideToLong: rideFinded.toLong,
      rideDate: rideFinded.date,
    };
  }
}

type InputDto = {
  rideId: string;
};

type OutputDto = {
  rideId: string;
  ridePassengerId: string;
  rideDriverId: string | null;
  rideStatus: string;
  rideFare: number | null;
  rideDistance: number | null;
  rideFromLat: number;
  rideFromLong: number;
  rideToLat: number;
  rideToLong: number;
  rideDate: string | null;
};