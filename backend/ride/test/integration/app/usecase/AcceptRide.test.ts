import crypto from 'crypto';
import Ride from '../../../../src/domain/entity/Ride';
import AcceptRide from '../../../../src/app/usecase/AcceptRide';
import RideRepository from '../../../../src/infra/repository/RideRepository';
import RideRepositoryDatabase from '../../../../src/infra/repository/RideRepositoryDatabase';
import DatabaseConnection from '../../../../src/infra/database/DatabaseConnection';
import PgPromiseAdapter from '../../../../src/infra/database/PgPromiseAdapter';
import AccountGateway from '../../../../src/infra/gateway/AccountGateway';
import AccountGatewayHttp from '../../../../src/infra/gateway/AccountGatewayHttp';
import AxiosAdapter from '../../../../src/infra/http/AxiosAdapter';

describe('testes para caso de uso de aceitar uma corrida', () => {
  let accountGateway: AccountGateway;
  let rideRepository: RideRepository;
  let useCase: AcceptRide;
  let rideData: {
    rideId: string;
    driverId: string;
    passengerId: string;
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
    const axios = new AxiosAdapter();
    accountGateway = new AccountGatewayHttp(axios);
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
    useCase = new AcceptRide(rideRepository, accountGateway);
    rideData = {
      rideId: rideRequested.id,
      driverId: driverAccount.accountId,
      passengerId: passengerAccount.accountId
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
    const rideAccepted = await rideRepository.getById(rideId);
    if (!rideAccepted) throw new Error('Ride not found');
    expect(rideAccepted.getStatus()).toBe('accepted');
  });
});