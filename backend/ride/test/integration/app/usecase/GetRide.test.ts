import Ride from '../../../../src/domain/entity/Ride';
import GetRide from '../../../../src/app/usecase/GetRide';
import DatabaseConnection from '../../../../src/infra/database/DatabaseConnection';
import PgPromiseAdapter from '../../../../src/infra/database/PgPromiseAdapter';
import RideRepository from '../../../../src/infra/repository/RideRepository';
import RideRepositoryDatabase from '../../../../src/infra/repository/RideRepositoryDatabase';

describe('teste para caso de uso de obter corrida', () => {
  let rideRepository: RideRepository;
  let useCase: GetRide;
  let rideData: {
    rideId: string;
  };
  let database: DatabaseConnection;

  beforeAll(async () => {
    database = new PgPromiseAdapter();
    await database.connect();
  });

  afterAll(async () => {
    await database.disconnect();
  });

  beforeEach(async () => {
    rideRepository = new RideRepositoryDatabase(database);
    const rideRequested = await rideRepository.save(Ride.create(
      '550e8400-e29b-41d4-a716-446655440000',
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    ));
    if (!rideRequested) throw new Error('Ride not found');
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
    rideData.rideId = '550e8400-e29b-41d4-a716-446655440000';
    const input = rideData;
    await expect(useCase.execute(input)).rejects.toThrow('Ride not found.');
  });
});