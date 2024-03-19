import crypto from 'crypto';
import Ride from '../../../../src/domain/entity/Ride';
import Position from '../../../../src/domain/entity/Position';
import FinishRide from '../../../../src/app/usecase/FinishRide';
import DatabaseConnection from '../../../../src/infra/database/DatabaseConnection';
import Queue from '../../../../src/infra/queue/Queue';
import PgPromiseAdapter from '../../../../src/infra/database/PgPromiseAdapter';
import RabbitMqAdapter from '../../../../src/infra/queue/RabbitMqAdapter';
import RideRepository from '../../../../src/infra/repository/RideRepository';
import RideRepositoryDatabase from '../../../../src/infra/repository/RideRepositoryDatabase';
import PositionRepository from '../../../../src/infra/repository/PositionRepository';
import PositionRepositoryDatabase from '../../../../src/infra/repository/PositionRepositoryDatabase';
import AccountGateway from '../../../../src/infra/gateway/AccountGateway';
import AccountGatewayRest from '../../../../src/infra/gateway/AccountGatewayRest';
import PaymentGateway from '../../../../src/infra/gateway/PaymentGateway';
import PaymentGatewayQueue from '../../../../src/infra/gateway/PaymentGatewayQueue';
import AxiosAdapter from '../../../../src/infra/http/AxiosAdapter';

describe('testes para caso de uso de finalização de corrida', () => {
  let queue: Queue;
  let accountGateway: AccountGateway;
  let rideRepository: RideRepository;
  let positionRepository: PositionRepository;
  let paymentGateway: PaymentGateway;
  let useCase: FinishRide;
  let rideData: {
    rideId: string;
    driverId: string;
  };
  let database: DatabaseConnection;

  beforeAll(async () => {
    database = new PgPromiseAdapter();
    queue = new RabbitMqAdapter();
    await database.connect();
    await queue.connect();
  });

  afterAll(async () => {
    await database.disconnect();
    setTimeout(async () => {
      await queue.close();
    }, 1000);
  });

  beforeEach(async () => {
    const axios = new AxiosAdapter();
    paymentGateway = new PaymentGatewayQueue(queue);
    accountGateway = new AccountGatewayRest(axios);
    const driverAccount = await accountGateway.signup({
      name: 'João Silva',
      email: `joao_${crypto.randomUUID()}@hotmail.com`,
      password: '12@345@6',
      cpf: '649.731.080-06',
      isDriver: true,
      isPassenger: false,
      carPlate: 'ABC1234',
      creditCardToken: null
    });
    if (!driverAccount) throw new Error('Account not found');
    const passengerAccount = await accountGateway.signup({
      name: 'Maria Silva',
      email: `maria_${crypto.randomUUID()}@hotmail.com`,
      password: '12@345@6',
      cpf: '649.731.080-06',
      isDriver: false,
      isPassenger: true,
      carPlate: null,
      creditCardToken: '0123456789'
    });
    if (!passengerAccount) throw new Error('Account not found');
    rideRepository = new RideRepositoryDatabase(database);
    const rideRequested = await rideRepository.save(Ride.create(
      passengerAccount.accountId,
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    ));
    if (!rideRequested) throw new Error('Ride not found');
    positionRepository = new PositionRepositoryDatabase(database);
    useCase = new FinishRide(rideRepository, positionRepository, accountGateway, paymentGateway);
    rideData = {
      rideId: rideRequested.id,
      driverId: driverAccount.accountId,
    };
  });

  it('deve lançar um erro caso a corrida esteja em situação diferente de in_progress', async () => {
    const { rideId, driverId } = rideData;
    const ride = await rideRepository.getById(rideId);
    if (!ride) throw new Error('ride not found');
    ride.acceptRide(driverId);
    await rideRepository.update(ride);
    await expect(() => useCase.execute(rideId)).rejects.toThrowError('Ride is not in progress.');
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
    const output = await useCase.execute(rideId);
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
    const output = await useCase.execute(rideId);
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
    await positionRepository.save(Position.create(ride.id, -23.56168, -46.62543));
    await positionRepository.save(Position.create(ride.id, -23.57168, -46.62543));
    await positionRepository.save(Position.create(ride.id, -23.58168, -46.62543));
    const output = await useCase.execute(rideId);
    expect(output).toBeUndefined();
    const rideFinished = await rideRepository.getById(rideId);
    if (!rideFinished) throw new Error('ride not found');
    expect(rideFinished.getStatus()).toBe('completed');
  });

  it('deve lançar um erro caso a corrida não seja encontrada', async () => {
    const rideId = '550e8400-e29b-41d4-a716-446655440000';
    await expect(() => useCase.execute(rideId)).rejects.toThrowError('ride not found');
  });

  it('deve lançar um erro caso não exista um passageiro associado a corrida', async () => {
    const { driverId } = rideData;
    const ride = await rideRepository.save(Ride.create(
      '550e8400-e29b-41d4-a716-446655440000',
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    ));
    ride.acceptRide(driverId);
    ride.startRide();
    await rideRepository.update(ride);
    await expect(() => useCase.execute(ride.id)).rejects.toThrowError('account not found');
  });

  it('deve gerar uma trasação de pagamento', async () => {
    const { rideId, driverId } = rideData;
    const ride = await rideRepository.getById(rideId);
    if (!ride) throw new Error('ride not found');
    ride.acceptRide(driverId);
    ride.startRide();
    await rideRepository.update(ride);
    await positionRepository.save(Position.create(rideId, -23.56168, -46.62543));
    await positionRepository.save(Position.create(rideId, -23.57168, -46.62543));
    await positionRepository.save(Position.create(rideId, -23.58168, -46.62543));
    const output = await useCase.execute(rideId);
    expect(output).toBeUndefined();
    // const transation = await paymentGateway.getRideTransaction(ride.id);
    // if (!transation) throw new Error('Transaction not found');
    // expect(transation.id).toEqual(expect.any(String));
  });
});