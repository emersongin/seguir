import RideRepository from '../../../src/infra/repository/RideRepository';
import GetRide from '../../../src/app/usecase/GetRide';
import MemoryRideRepository from '../../../src/infra/repository/MemoryRideRepository';

describe('teste para caso de uso de obter corrida', () => {
  let rideRepository: RideRepository;
  let useCase: GetRide;
  let rideData: {
    rideId: string;
  };

  beforeEach(() => {
    rideRepository = new MemoryRideRepository();
    useCase = new GetRide(rideRepository);
    rideData = {
      rideId: '51b08801-abd1-4a11-99a6-33d23c43aa93',
    };
  });

  it('deve retornar uma corrida', async () => {
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