import crypto from 'crypto';
import Ride from '../../../../src/domain/entity/Ride';
import UpdatePosition from '../../../../src/app/usecase/UpdatePosition';
import DatabaseConnection from '../../../../src/infra/database/DatabaseConnection';
import PgPromiseAdapter from '../../../../src/infra/database/PgPromiseAdapter';
import RideRepository from '../../../../src/infra/repository/RideRepository';
import RideRepositoryDatabase from '../../../../src/infra/repository/RideRepositoryDatabase';
import PositionRepository from '../../../../src/infra/repository/PositionRepository';
import PositionRepositoryDatabase from '../../../../src/infra/repository/PositionRepositoryDatabase';
import AccountGateway from '../../../../src/infra/gateway/AccountGateway';
import AccountGatewayHttp from '../../../../src/infra/gateway/AccountGatewayHttp';
import AxiosAdapter from '../../../../src/infra/http/AxiosAdapter';

describe('teste para caso de uso de atualizar posição', () => {
  let accountGateway: AccountGateway;
  let rideRepository: RideRepository;
  let positionRepository: PositionRepository;
  let useCase: UpdatePosition;
  let rideData: {
    rideId: string;
    passengerId: string;
    latPosition: number; 
    longPosition: number; 
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
    const ride = Ride.create(
      passengerAccount.accountId,
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    );
    ride.acceptRide(driverAccount.accountId);
    ride.startRide();
    const rideSaved = await rideRepository.save(ride);
    if (!rideSaved) throw new Error('Ride not found');
    positionRepository = new PositionRepositoryDatabase(database);
    useCase = new UpdatePosition(rideRepository, positionRepository);
    rideData = {
      rideId: rideSaved.id,
      passengerId: passengerAccount.accountId,
      latPosition: rideSaved.getFromLat(),
      longPosition: rideSaved.getFromLong(),
    };
  });

  it('deve atualizar a ultima posição da corrida', async () => {
    const input = {
      rideId: rideData.rideId,
      latPosition: -21.56168,
      longPosition: -42.62543,
    };
    const output = await useCase.execute(input);
    expect(output).toBeUndefined();
    const ride = await rideRepository.getById(rideData.rideId);
    if (!ride) return;
    expect(ride.getFromLat()).toBe(rideData.latPosition);
    expect(ride.getFromLong()).toBe(rideData.longPosition);
  });

  it('deve criar a ultima posição da corrida', async () => {
    const input = {
      rideId: rideData.rideId,
      latPosition: -24.56168,
      longPosition: -47.62543,
    };
    const output = await useCase.execute(input);
    const postions = await positionRepository.getAllPositionByRideId(rideData.rideId);
    expect(postions).toHaveLength(1);
  });

  it('deve lançar erro se corrida não estiver com status in_progress', async () => {
    const { passengerId } = rideData;
    const ride = Ride.create(
      passengerId,
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    );
    const rideSaved = await rideRepository.save(ride);
    const input = {
      rideId: rideSaved.id,
      latPosition: -23.56168,
      longPosition: -46.62543
    };
    await expect(useCase.execute(input)).rejects.toThrow('Ride is not in progress.');
  });

  it('deve atualizar a distancia da corrida se as coordenadas forem diferentes', async () => {
    const input = {
      rideId: rideData.rideId,
      latPosition: -24.56168,
      longPosition: -47.62543,
    };
    const output = await useCase.execute(input);
    const ride = await rideRepository.getById(rideData.rideId);
    if (!ride) return;
    expect(ride.getDistance()).toBeGreaterThan(0);
  });
});