import AccountRepository from '../../../../src/infra/repository/AccountRepository';
import RideRepository from '../../../../src/infra/repository/RideRepository';
import SQLDataBaseGateway from '../../../../src/infra/gateway/SQLDataBaseGateway';
import SQLDataBaseGatewayPGP from '../../../../src/infra/gateway/SQLDataBaseGatewayPGP';
import FinishRide from '../../../../src/app/usecase/FinishRide';
import AccountRepositoryDatabase from '../../../../src/infra/repository/AccountRepositoryDatabase';
import RideRepositoryDatabase from '../../../../src/infra/repository/RideRepositoryDatabase';
import Account from '../../../../src/domain/entity/Account';
import Ride from '../../../../src/domain/entity/Ride';

describe('testes para caso de uso de finalização de corrida', () => {
  let accountRepository: AccountRepository;
  let rideRepository: RideRepository;
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
    useCase = new FinishRide(rideRepository);
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
    rideRepository.update(ride);
    const input = { rideId };
    await expect(() => useCase.execute(input)).rejects.toThrowError('Ride is not in progress.');
  });
});