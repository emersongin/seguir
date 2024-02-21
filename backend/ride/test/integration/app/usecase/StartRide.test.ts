import RideRepository from '../../../../src/infra/repository/RideRepository';
import AccountRepository from '../../../../src/infra/repository/AccountRepository';
import RideRepositoryMemory from '../../../../src/infra/repository/RideRepositoryMemory';
import AccountRepositoryMemory from '../../../../src/infra/repository/AccountRepositoryMemory';
import StartRide from '../../../../src/app/usecase/StartRide';
import Ride from '../../../../src/domain/entity/Ride';
import SQLDataBaseGateway from '../../../../src/infra/gateway/SQLDataBaseGateway';
import SQLDataBaseGatewayPGP from '../../../../src/infra/gateway/SQLDataBaseGatewayPGP';
import RideRepositoryDatabase from '../../../../src/infra/repository/RideRepositoryDatabase';
import AccountRepositoryDatabase from '../../../../src/infra/repository/AccountRepositoryDatabase';

describe('testes para caso de uso de iniciar corrida', () => {
  let rideRepository: RideRepository;
  let accountRepository: AccountRepository;
  let useCase: StartRide;
  let rideData: {
    rideId: string;
  };
  let database: SQLDataBaseGateway;

  beforeAll(async () => {
    database = new SQLDataBaseGatewayPGP();
    await database.connect();
  });

  afterAll(async () => {
    await database.disconnect();
  });

  beforeEach(async () => {
    rideRepository = new RideRepositoryDatabase(database);
    const fakePassengerId = '550e8400-e29b-41d4-a716-446655440000';
    const ride = await rideRepository.save(Ride.create(
      fakePassengerId,
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    ));
    if (!ride) throw new Error('Ride not found');
    accountRepository = new AccountRepositoryDatabase(database);
    useCase = new StartRide(rideRepository, accountRepository);
    rideData = {
      rideId: ride.id,
    };
  });

  it('deve iniciar corrida', async () => {
    const { rideId } = rideData;
    const ride = await rideRepository.getById(rideId);
    if (!ride) throw new Error('Ride not found');
    const fakeDriverId = '550e8400-e29b-41d4-a716-446655440001';
    ride.acceptRide(fakeDriverId);
    await rideRepository.update(ride);
    const input = rideData;
    const output = await useCase.execute(input);
    expect(output).toBeUndefined();
    const rideStarted = await rideRepository.getById(rideId);
    if (!rideStarted) throw new Error('Ride not found');
    expect(rideStarted.getStatus()).toBe('in_progress');
  });

  it('deve lançar erro se a corrida não existir', async () => {
    const invalidRideId = '550e8400-e29b-41d4-a716-446655440000';
    const input = { rideId: invalidRideId };
    await expect(useCase.execute(input)).rejects.toThrow('Ride not found.');
  });

  it('deve lançar erro se status de corrida estiver diferente de "accepted"', async () => {
    const input = rideData;
    await expect(useCase.execute(input)).rejects.toThrow('Ride already started.');
  });
});