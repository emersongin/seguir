import RideRepository from '../../../../src/infra/repository/RideRepository';
import AccountRepository from '../../../../src/infra/repository/AccountRepository';
import RideRepositoryMemory from '../../../../src/infra/repository/RideRepositoryMemory';
import AccountRepositoryMemory from '../../../../src/infra/repository/AccountRepositoryMemory';
import StartRide from '../../../../src/app/usecase/StartRide';
import Ride from '../../../../src/domain/entity/Ride';
import SQLDataBaseGateway from '../../../../src/infra/gateway/SQLDataBaseGateway';
import SQLDataBaseGatewayPGP from '../../../../src/infra/gateway/SQLDataBaseGatewayPGP';
import RideRepositoryPGP from '../../../../src/infra/repository/RideRepositoryPGP';
import AccountRepositoryPGP from '../../../../src/infra/repository/AccountRepositoryPGP';

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
    rideRepository = new RideRepositoryPGP(database);
    const ride = await rideRepository.saveRide(Ride.createRide(
      '550e8400-e29b-41d4-a716-446655440000',
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    ));
    accountRepository = new AccountRepositoryPGP(database);
    useCase = new StartRide(rideRepository, accountRepository);
    rideData = {
      rideId: ride.id || '',
    };
  });

  it('deve iniciar corrida', async () => {
    const { rideId } = rideData;
    const ride = await rideRepository.findRideById(rideId);
    if (ride) {
      ride.acceptDriver('550e8400-e29b-41d4-a716-446655440000');
      await rideRepository.updateRide(ride);
    }
    const input = rideData;
    const output = await useCase.execute(input);
    expect(output).toBeUndefined();
  });

  it('deve lançar erro se a corrida não existir', async () => {
    const input = {
      rideId: '550e8400-e29b-41d4-a716-446655440000',
    };
    await expect(useCase.execute(input)).rejects.toThrow('Ride not found.');
  });

  it('deve lançar erro se status de corrida estiver diferente de "accepted"', async () => {
    const input = rideData;
    await expect(useCase.execute(input)).rejects.toThrow('Ride already started.');
  });
});