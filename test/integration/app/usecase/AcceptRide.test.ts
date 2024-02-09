import RideRepository from '../../../../src/infra/repository/RideRepository';
import RideRepositoryMemory from '../../../../src/infra/repository/RideRepositoryMemory';
import AcceptRide from '../../../../src/app/usecase/AcceptRide';
import AccountRepositoryMemory from '../../../../src/infra/repository/AccountRepositoryMemory';
import AccountRepository from '../../../../src/infra/repository/AccountRepository';
import Ride from '../../../../src/domain/entity/Ride';
import Account from '../../../../src/domain/entity/Account';
import RideRepositoryPGP from '../../../../src/infra/repository/RideRepositoryPGP';
import AccountRepositoryPGP from '../../../../src/infra/repository/AccountRepositoryPGP';
import SQLDataBaseGatewayPGP from '../../../../src/infra/gateway/SQLDataBaseGatewayPGP';
import SQLDataBaseGateway from '../../../../src/infra/gateway/SQLDataBaseGateway';

describe('testes para caso de uso de aceitar uma corrida', () => {
  let accountRepository: AccountRepository;
  let rideRepository: RideRepository;
  let useCase: AcceptRide;
  let rideData: {
    rideId: string;
    driverId: string;
    passengerId: string;
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
    const driverAccount = await accountRepository.saveAccount(Account.createAccount(
      'João Silva',
      'joao@hotmail.com',
      '12@345@6',
      '649.731.080-06',
      true,
      false,
      'ABC1234'
    ));
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
    const rideRequested = await rideRepository.saveRide(Ride.createRide(
      passengerAccount.id || '',
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    ));
    useCase = new AcceptRide(rideRepository, accountRepository);
    rideData = {
      rideId: rideRequested.id || '',
      driverId: driverAccount.id || '',
      passengerId: passengerAccount.id || ''
    };
  });

  it('deve lançar erro se a conta não existir', async () => {
    const { rideId } = rideData;
    const input = {
      rideId,
      driverId: '550e8400-e29b-41d4-a716-446655440000',
    };
    await expect(useCase.execute(input)).rejects.toThrow('Account not found.');
  });

  it('deve lançar erro se a conta que esta aceitando a corrida não é motorista', async () => {
    const { rideId, passengerId } = rideData;
    const input = { 
      rideId, 
      driverId: passengerId 
    };
    await expect(useCase.execute(input)).rejects.toThrow('Account is not a driver\'s.');
  });

  it('deve aceitar a corrida apenas se o status estiver como requested', async () => {
    const { rideId, driverId } = rideData;
    const ride = await rideRepository.findRideById(rideId);
    if (ride) {
      ride.startRide();
      await rideRepository.updateRide(ride);
    }
    const input = {
      rideId,
      driverId
    };
    await expect(useCase.execute(input)).rejects.toThrow('Invalid ride to accept.');
  });

  it('deve lançar erro se houver corrida com status in_progresso', async () => {
    const { rideId, driverId, passengerId } = rideData;
    const rideRequested = await rideRepository.saveRide(Ride.createRide(
      passengerId,
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    ));
    rideRequested.acceptDriver(driverId);
    rideRequested.startRide();
    await rideRepository.updateRide(rideRequested);
    const input = {
      rideId,
      driverId
    };
    await expect(useCase.execute(input)).rejects.toThrow('Ride already accepted or in progress.');
  });

  it('deve lançar erro se houver corrida com status accepted', async () => {
    const { rideId, driverId, passengerId } = rideData;
    const rideRequested = await rideRepository.saveRide(Ride.createRide(
      passengerId,
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    ));
    rideRequested.acceptDriver(driverId);
    await rideRepository.updateRide(rideRequested);
    const input = {
      rideId,
      driverId
    };
    await expect(useCase.execute(input)).rejects.toThrow('Ride already accepted or in progress.');
  });

  it('deve aceitar corrida valida', async () => {
    const { rideId, driverId } = rideData;
    const input = {
      rideId,
      driverId
    };
    const output = await useCase.execute(input);
    expect(output).toBeUndefined();
  });
});