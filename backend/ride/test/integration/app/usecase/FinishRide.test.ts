import AccountRepository from '../../../../src/infra/repository/AccountRepository';
import RideRepository from '../../../../src/infra/repository/RideRepository';
import SQLDataBaseGateway from '../../../../src/infra/gateway/SQLDataBaseGateway';
import SQLDataBaseGatewayPGP from '../../../../src/infra/gateway/SQLDataBaseGatewayPGP';
import FinishRide from '../../../../src/app/usecase/FinishRide';
import AccountRepositoryDatabase from '../../../../src/infra/repository/AccountRepositoryDatabase';
import RideRepositoryDatabase from '../../../../src/infra/repository/RideRepositoryDatabase';
import Account from '../../../../src/domain/entity/Account';
import Ride from '../../../../src/domain/entity/Ride';
import PositionRepository from '../../../../src/infra/repository/PositionRepository';
import PositionRepositoryDatabase from '../../../../src/infra/repository/PositionRepositoryDatabase';
import Position from '../../../../src/domain/entity/Position';

describe('testes para caso de uso de finalização de corrida', () => {
  let accountRepository: AccountRepository;
  let rideRepository: RideRepository;
  let positionRepository: PositionRepository;
  let useCase: FinishRide;
  let rideData: {
    rideId: string;
    driverId: string;
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
    if (!driverAccount) throw new Error('Account not found');
    const passengerAccount = await accountRepository.save(Account.create(
      'Maria Silva',
      'maria@hotmail.com',
      '12@345@6',
      '649.731.080-06',
      false,
      true,
      null
    ));
    if (!passengerAccount) throw new Error('Account not found');
    rideRepository = new RideRepositoryDatabase(database);
    const rideRequested = await rideRepository.save(Ride.create(
      passengerAccount.id,
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    ));
    if (!rideRequested) throw new Error('Ride not found');
    positionRepository = new PositionRepositoryDatabase(database);
    useCase = new FinishRide(rideRepository, positionRepository);
    rideData = {
      rideId: rideRequested.id,
      driverId: driverAccount.id,
    };
  });

  it('deve lançar um erro caso a corrida esteja em situação diferente de in_progress', async () => {
    const { rideId, driverId } = rideData;
    const ride = await rideRepository.getById(rideId);
    if (!ride) throw new Error('ride not found');
    ride.acceptRide(driverId);
    await rideRepository.update(ride);
    const input = { rideId };
    await expect(() => useCase.execute(input)).rejects.toThrowError('Ride is not in progress.');
  });

  it('deve calcular a distância percorrida em km', async () => {
    const { rideId, driverId } = rideData;
    const ride = await rideRepository.getById(rideId);
    if (!ride) throw new Error('ride not found');
    ride.acceptRide(driverId);
    ride.startRide();
    await rideRepository.update(ride);
    await positionRepository.save(Position.create(rideId, -23.56168, -46.62543));
    await positionRepository.save(Position.create(rideId, -23.57168, -46.62543));
    await positionRepository.save(Position.create(rideId, -23.58168, -46.62543));
    const input = { rideId };
    const output = await useCase.execute(input);
    expect(output).toBeUndefined();
    const expectDistanceTotal = 2;
    const rideFinished = await rideRepository.getById(rideId);
    if (!rideFinished) throw new Error('ride not found');
    expect(rideFinished.getDistance()).toBe(expectDistanceTotal);
  });

  it('deve calcular o valor da corrida', async () => {
    const { rideId, driverId } = rideData;
    const ride = await rideRepository.getById(rideId);
    if (!ride) throw new Error('ride not found');
    ride.acceptRide(driverId);
    ride.startRide();
    await rideRepository.update(ride);
    await positionRepository.save(Position.create(rideId, -23.56168, -46.62543));
    await positionRepository.save(Position.create(rideId, -23.57168, -46.62543));
    await positionRepository.save(Position.create(rideId, -23.58168, -46.62543));
    const input = { rideId };
    const output = await useCase.execute(input);
    expect(output).toBeUndefined();
    const expectFareTotal = 2 * 2.1;
    const rideFinished = await rideRepository.getById(rideId);
    if (!rideFinished) throw new Error('ride not found');
    expect(rideFinished.getFare()).toBe(expectFareTotal);
  });

  it('deve finalizar a corrida com status de completed', async () => {
    const { rideId, driverId } = rideData;
    const ride = await rideRepository.getById(rideId);
    if (!ride) throw new Error('ride not found');
    ride.acceptRide(driverId);
    ride.startRide();
    await rideRepository.update(ride);
    await positionRepository.save(Position.create(rideId, -23.56168, -46.62543));
    await positionRepository.save(Position.create(rideId, -23.57168, -46.62543));
    await positionRepository.save(Position.create(rideId, -23.58168, -46.62543));
    const input = { rideId };
    const output = await useCase.execute(input);
    expect(output).toBeUndefined();
    const rideFinished = await rideRepository.getById(rideId);
    if (!rideFinished) throw new Error('ride not found');
    expect(rideFinished.getStatus()).toBe('completed');
  });
});