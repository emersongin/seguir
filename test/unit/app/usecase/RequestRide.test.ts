import AccountRepository from '../../../../src/infra/repository/AccountRepository';
import MemoryAccountRepository from '../../../../src/infra/repository/MemoryAccountRepository';
import RideRepository from '../../../../src/infra/repository/RideRepository';
import RequestRide from '../../../../src/app/usecase/RequestRide';
import MemoryRideRepository from '../../../../src/infra/repository/MemoryRideRepository';
import Account from '../../../../src/domain/entity/Account';
import Ride from '../../../../src/domain/entity/Ride';

describe('testes para caos de uso de solicitar corrida', () => {
  let accountRepository: AccountRepository;
  let rideRepository: RideRepository;
  let useCase: RequestRide;
  let requestData: {
    passengerId: string;
    fromLat: number;
    fromLong: number;
    toLat: number;
    toLong: number;
  };

  beforeEach(async () => {
    accountRepository = new MemoryAccountRepository();
    const passengerAccount = await accountRepository.saveAccount(Account.createAccount(
      'Maria Silva',
      'maria@hotmail.com',
      '12@345@6',
      '649.731.080-06',
      false,
      true,
      null
    ));
    rideRepository = new MemoryRideRepository();
    useCase = new RequestRide(rideRepository, accountRepository);
    requestData = {
      passengerId: passengerAccount.id || '',
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
  });

  it('deve lançar um erro se conta não existir', async () => {
    requestData.passengerId = 'invalid_id';
    const input = requestData;
    await expect(useCase.execute(input)).rejects.toThrow('Account not found.');
  });

  it('deve lançar erro se conta utilizada não for passageiro', async () => {
    const driverAccount = await accountRepository.saveAccount(Account.createAccount(
      'João Silva',
      'joao@hotmail.com',
      '12@345@6',
      '649.731.080-06',
      true,
      false,
      'ABC1234'
    ));
    requestData.passengerId = driverAccount.id || '';
    const input = requestData;
    await expect(useCase.execute(input)).rejects.toThrow('Account is not a passenger\'s.');
  });

  it('deve lançar erro se existir corrida ativa para passageiro', async () => {
    const { passengerId } = requestData;
    const rideRequested = await rideRepository.saveRide(Ride.createRide(
      passengerId,
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    ));
    const input = requestData;
    await expect(useCase.execute(input)).rejects.toThrow('Passenger with active ride.');
  });
});