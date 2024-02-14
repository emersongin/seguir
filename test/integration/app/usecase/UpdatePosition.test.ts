import SQLDataBaseGateway from '../../../../src/infra/gateway/SQLDataBaseGateway';
import SQLDataBaseGatewayPGP from '../../../../src/infra/gateway/SQLDataBaseGatewayPGP';
import AcceptRide from '../../../../src/app/usecase/AcceptRide';
import AccountRepositoryDatabase from '../../../../src/infra/repository/AccountRepositoryDatabase';
import RideRepositoryDatabase from '../../../../src/infra/repository/RideRepositoryDatabase';
import AccountRepository from '../../../../src/infra/repository/AccountRepository';
import RideRepository from '../../../../src/infra/repository/RideRepository';
import UpdatePosition from '../../../../src/app/usecase/UpdatePosition';
import Account from '../../../../src/domain/entity/Account';
import Ride from '../../../../src/domain/entity/Ride';
import PositionRepositoryDatabase from '../../../../src/infra/repository/PositionRepositoryDatabase';
import PositionRepository from '../../../../src/infra/repository/PositionRepository';

describe('teste para caso de uso de atualizar posição', () => {
  let accountRepository: AccountRepository;
  let rideRepository: RideRepository;
  let positionRepository: PositionRepository;
  let useCase: UpdatePosition;
  let rideData: {
    rideId: string;
    passengerId: string;
    latPosition: number; 
    longPosition: number; 
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
    const ride = Ride.create(
      passengerAccount.id,
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    );
    ride.acceptRide(driverAccount.id);
    ride.startRide();
    const rideSaved = await rideRepository.save(ride);
    if (!rideSaved) throw new Error('Ride not found');
    positionRepository = new PositionRepositoryDatabase(database);
    useCase = new UpdatePosition(rideRepository, positionRepository);
    rideData = {
      rideId: rideSaved.id,
      passengerId: passengerAccount.id,
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