import AccountRepository from '../../../src/infra/repository/AccountRepository';
import MemoryAccountRepository from '../../../src/infra/repository/MemoryAccountRepository';
import RideRepository from '../../../src/infra/repository/RideRepository';
import RequestRide from '../../../src/app/usecase/RequestRide';
import MemoryRideRepository from '../../../src/infra/repository/MemoryRideRepository';

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

  beforeEach(() => {
    accountRepository = new MemoryAccountRepository();
    rideRepository = new MemoryRideRepository();
    useCase = new RequestRide(rideRepository, accountRepository);
    requestData = {
      passengerId: '79a3baf5-7ad5-41e4-9088-e52a1caba2f1',
      fromLat: -23.56168,
      fromLong: -46.62543,
      toLat: -23.56168,
      toLong: -46.62543,
    };
  });

  it('solicita uma corrida!', async () => {
    const input = requestData;
    const output = await useCase.execute(input);
    expect(output).toHaveProperty('rideId');
  });

  it('a conta deve existir', async () => {
    requestData.passengerId = 'invalidId';
    const input = requestData;
    await expect(useCase.execute(input)).rejects.toThrow('Account not found.');
  });

  it('a conta utilizada de ser de um passageiro', async () => {
    requestData.passengerId = '382d8d91-34b8-4118-a294-3c22847f48f5';
    const input = requestData;
    await expect(useCase.execute(input)).rejects.toThrow('Account is not a passenger\'s.');
  });

  it('o passageiro não deve ter outra corrida ativa', async () => {
    requestData.passengerId = '046ba3b6-9425-4a42-8f24-e793462e936a';
    const input = requestData;
    await expect(useCase.execute(input)).rejects.toThrow('Passenger with active ride.');
  });
});