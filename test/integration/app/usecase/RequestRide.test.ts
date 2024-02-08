import AccountRepository from '../../../../src/infra/repository/AccountRepository';
import AccountRepositoryMemory from '../../../../src/infra/repository/AccountRepositoryMemory';
import RideRepository from '../../../../src/infra/repository/RideRepository';
import RequestRide from '../../../../src/app/usecase/RequestRide';
import RideRepositoryMemory from '../../../../src/infra/repository/RideRepositoryMemory';
import Account from '../../../../src/domain/entity/Account';
import Ride from '../../../../src/domain/entity/Ride';
import RideRepositoryPGP from '../../../../src/infra/repository/RideRepositoryPGP';
import AccountRepositoryPGP from '../../../../src/infra/repository/AccountRepositoryPGP';
import SQLDataBaseGatewayPGP from '../../../../src/infra/gateway/SQLDataBaseGatewayPGP';
import SQLDataBaseGateway from '../../../../src/infra/gateway/SQLDataBaseGateway';

describe('testes para caos de uso de solicitar corrida', () => {
  let accountRepository: AccountRepository;
  let rideRepository: RideRepository;
  let useCase: RequestRide;
  let requestData: {
    passengerId: string;
    fromLat: number;
    fromLong: number;
    toLat: number;
    toLong: number;
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
    accountRepository = new AccountRepositoryPGP(database);
    const passengerAccount = await accountRepository.saveAccount(Account.createAccount(
      'Maria Silva',
      'maria@hotmail.com',
      '12@345@6',
      '649.731.080-06',
      false,
      true,
      null
    ));
    rideRepository = new RideRepositoryPGP(database);
    useCase = new RequestRide(rideRepository, accountRepository);
    requestData = {
      passengerId: passengerAccount.id || '',
      fromLat: -23.56168,
      fromLong: -46.62543,
      toLat: -23.56168,
      toLong: -46.62543,
    };
  });

  it('deve solicitar corrida se valida', async () => {
    const input = requestData;
    const output = await useCase.execute(input);
    expect(output).toHaveProperty('rideId');
  });

  it('deve lançar um erro se conta não existir', async () => {
    requestData.passengerId = '550e8400-e29b-41d4-a716-446655440000';
    const input = requestData;
    await expect(useCase.execute(input)).rejects.toThrow('Account not found.');
  });

  it('deve lançar erro se conta utilizada não for passageiro', async () => {
    const driverAccount = await accountRepository.saveAccount(Account.createAccount(
      'João Silva',
      'joao@hotmail.com',
      '12@345@6',
      '649.731.080-06',
      true,
      false,
      'ABC1234'
    ));
    requestData.passengerId = driverAccount.id || '';
    const input = requestData;
    await expect(useCase.execute(input)).rejects.toThrow('Account is not a passenger\'s.');
  });

  it('deve lançar erro se existir corrida ativa para passageiro', async () => {
    const { passengerId } = requestData;
    const rideRequested = await rideRepository.saveRide(Ride.createRide(
      passengerId,
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    ));
    rideRequested.acceptDriver('550e8400-e29b-41d4-a716-446655440000');
    await rideRepository.updateRide(rideRequested);
    const input = requestData;
    await expect(useCase.execute(input)).rejects.toThrow('Passenger with active ride.');
  });
});