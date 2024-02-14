import RideRepository from '../../../../src/infra/repository/RideRepository';
import RideRepositoryMemory from '../../../../src/infra/repository/RideRepositoryMemory';
import AcceptRide from '../../../../src/app/usecase/AcceptRide';
import AccountRepositoryMemory from '../../../../src/infra/repository/AccountRepositoryMemory';
import AccountRepository from '../../../../src/infra/repository/AccountRepository';
import Ride from '../../../../src/domain/entity/Ride';
import Account from '../../../../src/domain/entity/Account';
import RideRepositoryDatabase from '../../../../src/infra/repository/RideRepositoryDatabase';
import AccountRepositoryDatabase from '../../../../src/infra/repository/AccountRepositoryDatabase';
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
    accountRepository = new AccountRepositoryDatabase(database);
    const driverAccount = await accountRepository.save(Account.create(
      'João Silva',
      'joao@hotmail.com',
      '12@345@6',
      '649.731.080-06',
      true,
      false,
      'ABC1234'
    ));
    const passengerAccount = await accountRepository.save(Account.create(
      'Maria Silva',
      'maria@hotmail.com',
      '12@345@6',
      '649.731.080-06',
      false,
      true,
      null
    ));
    rideRepository = new RideRepositoryDatabase(database);
    const rideRequested = await rideRepository.save(Ride.create(
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

  it('deve lançar error se ao aceitar a corrida o status não estiver como requested', async () => {
    const { rideId, driverId } = rideData;
    const ride = await rideRepository.getById(rideId);
    if (!ride) throw new Error('Ride not found');
    ride.acceptRide(driverId);
    await rideRepository.update(ride);
    const input = {
      rideId,
      driverId
    };
    await expect(useCase.execute(input)).rejects.toThrow('Invalid ride to accept.');
  });

  it('deve lançar erro se houver corrida com status in_progresso', async () => {
    const { rideId, driverId, passengerId } = rideData;
    const rideRequested = await rideRepository.save(Ride.create(
      passengerId,
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    ));
    rideRequested.acceptRide(driverId);
    rideRequested.startRide();
    await rideRepository.update(rideRequested);
    const input = {
      rideId,
      driverId
    };
    await expect(useCase.execute(input)).rejects.toThrow('Ride already accepted or in progress.');
  });

  it('deve lançar erro se houver corrida com status accepted', async () => {
    const { rideId, driverId, passengerId } = rideData;
    const rideRequested = await rideRepository.save(Ride.create(
      passengerId,
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    ));
    rideRequested.acceptRide(driverId);
    await rideRepository.update(rideRequested);
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