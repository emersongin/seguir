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

describe('teste para caso de uso de atualizar posição', () => {
  let accountRepository: AccountRepository;
  let rideRepository: RideRepository;
  let useCase: UpdatePosition;
  let rideData: {
    rideId: string;
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
    const driverAccount = await accountRepository.save(Account.createAccount(
      'João Silva',
      'joao@hotmail.com',
      '12@345@6',
      '649.731.080-06',
      true,
      false,
      'ABC1234'
    ));
    const passengerAccount = await accountRepository.save(Account.createAccount(
      'Maria Silva',
      'maria@hotmail.com',
      '12@345@6',
      '649.731.080-06',
      false,
      true,
      null
    ));
    rideRepository = new RideRepositoryDatabase(database);
    const ride = Ride.createRide(
      passengerAccount.id,
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    );
    ride.acceptRide(driverAccount.id);
    ride.startRide();
    const rideSaved = await rideRepository.save(ride);
    useCase = new UpdatePosition(rideRepository);
    rideData = {
      rideId: rideSaved.id,
      latPosition: rideSaved.getFromLat(),
      longPosition: rideSaved.getFromLong(),
    };
  });

  it('deve atualizar a ultima posição da corrida', async () => {
    const input = rideData;
    const output = await useCase.execute(input);
    expect(output).toBeUndefined();
    const ride = await rideRepository.getById(rideData.rideId);
    if (!ride) return;
    expect(ride.getFromLat()).toBe(rideData.latPosition);
    expect(ride.getFromLong()).toBe(rideData.longPosition);
  });
});