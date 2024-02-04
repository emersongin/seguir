import RideRepository from '../../../../src/infra/repository/RideRepository';
import GetRide from '../../../../src/app/usecase/GetRide';
import MemoryRideRepository from '../../../../src/infra/repository/MemoryRideRepository';
import Ride from '../../../../src/domain/entity/Ride';

describe('teste para caso de uso de obter corrida', () => {
  let rideRepository: RideRepository;
  let useCase: GetRide;
  let rideData: {
    rideId: string;
  };

  beforeEach(async () => {
    rideRepository = new MemoryRideRepository();
    const rideRequested = await rideRepository.saveRide(Ride.createRide(
      'passengerAccountId',
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    ));
    useCase = new GetRide(rideRepository);
    rideData = {
      rideId: rideRequested.id,
    };
  });

  it('deve retornar corrida se existir', async () => {
    const input = rideData;
    const output = await useCase.execute(input);
    expect(output).toHaveProperty('rideId');
    expect(output).toHaveProperty('ridePassengerId');
    expect(output).toHaveProperty('rideDriverId');
    expect(output).toHaveProperty('rideStatus');
    expect(output).toHaveProperty('rideFare');
    expect(output).toHaveProperty('rideDistance');
    expect(output).toHaveProperty('rideFromLat');
    expect(output).toHaveProperty('rideFromLong');
    expect(output).toHaveProperty('rideToLat');
    expect(output).toHaveProperty('rideToLong');
    expect(output).toHaveProperty('rideDate');
  });

  it('deve lançar um erro ao tentar obter uma corrida inexistente', async () => {
    rideData.rideId = 'invalid_id';
    const input = rideData;
    await expect(useCase.execute(input)).rejects.toThrow('Ride not found.');
  });
});