import RideRepository from '../../infra/repository/RideRepository';

export default class GetRide {
  constructor(
    private readonly rideRepository: RideRepository
  ) {}

  async execute(input: InputDto): Promise<OutputDto> {
    const { rideId } = input;
    const rideFinded = await this.rideRepository.getById(rideId);
    if (!rideFinded) throw new Error("Ride not found.");
    return {
      rideId: rideFinded.id,
      ridePassengerId: rideFinded.passengerId,
      rideDriverId: rideFinded.getDriverId(),
      rideStatus: rideFinded.getStatus(),
      rideFare: rideFinded.fare,
      rideDistance: rideFinded.getDistance(),
      rideFromLat: rideFinded.getFromLat(),
      rideFromLong: rideFinded.getFromLong(),
      rideToLat: rideFinded.getToLat(),
      rideToLong: rideFinded.getToLong(),
      rideDate: rideFinded.getDate(),
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
  rideDate: Date;
};