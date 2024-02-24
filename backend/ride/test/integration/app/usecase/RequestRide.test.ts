import crypto from 'crypto';
import Ride from '../../../../src/domain/entity/Ride';
import RequestRide from '../../../../src/app/usecase/RequestRide';
import RideRepository from '../../../../src/infra/repository/RideRepository';
import RideRepositoryDatabase from '../../../../src/infra/repository/RideRepositoryDatabase';
import SQLDataBaseGatewayPGP from '../../../../src/infra/gateway/SQLDataBaseGatewayPGP';
import SQLDataBaseGateway from '../../../../src/infra/gateway/SQLDataBaseGateway';
import AccountGateway from '../../../../src/infra/gateway/AccountGateway';
import AccountGatewayHttp from '../../../../src/infra/gateway/AccountGatewayHttp';

describe('testes para caos de uso de solicitar corrida', () => {
  let accountGateway: AccountGateway;
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
    accountGateway = new AccountGatewayHttp();
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
    useCase = new RequestRide(rideRepository, accountGateway);
    requestData = {
      passengerId: passengerAccount.accountId,
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
    if (!output) throw new Error('Ride not found');
    const rideRequested = await rideRepository.getById(output.rideId);
    if (!rideRequested) throw new Error('Ride not found');
    expect(rideRequested.getStatus()).toBe('requested');
  });

  it('deve lançar um erro se conta não existir', async () => {
    requestData.passengerId = '550e8400-e29b-41d4-a716-446655440000';
    const input = requestData;
    await expect(useCase.execute(input)).rejects.toThrow('Account not found.');
  });

  it('deve lançar erro se conta utilizada não for passageiro', async () => {
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
    requestData.passengerId = driverAccount.accountId;
    const input = requestData;
    await expect(useCase.execute(input)).rejects.toThrow('Account is not a passenger\'s.');
  });

  it('deve lançar erro se existir corrida ativa para passageiro', async () => {
    const { passengerId } = requestData;
    const rideRequested = await rideRepository.save(Ride.create(
      passengerId,
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    ));
    rideRequested.acceptRide('550e8400-e29b-41d4-a716-446655440000');
    await rideRepository.update(rideRequested);
    const input = requestData;
    await expect(useCase.execute(input)).rejects.toThrow('Passenger with active ride.');
  });
});