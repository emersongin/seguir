import RideRepository from '../../../src/infra/repository/RideRepository';
import MemoryRideRepository from '../../../src/infra/repository/MemoryRideRepository';
import AcceptRide from '../../../src/app/usecase/AcceptRide';
import MemoryAccountRepository from '../../../src/infra/repository/MemoryAccountRepository';
import AccountRepository from '../../../src/infra/repository/AccountRepository';
import { nowToISOString } from '../../../src/infra/helpers/dates';
import Ride from '../../../src/domain/entity/Ride';

describe('testes para caso de uso de aceitar uma corrida', () => {
  let accountRepository: AccountRepository;
  let rideRepository: RideRepository;
  let useCase: AcceptRide;
  let rideData: {
    rideId: string;
    driverId: string;
  };

  beforeEach(() => {
    accountRepository = new MemoryAccountRepository();
    rideRepository = new MemoryRideRepository();
    useCase = new AcceptRide(rideRepository, accountRepository);
    rideData = {
      rideId: '51b08801-abd1-4a11-99a6-33d23c43aa93',
      driverId: '382d8d91-34b8-4118-a294-3c22847f48f5',
    };
  });

  it('a conta deve existir', async () => {
    rideData.driverId = 'invalidId';
    const input = rideData;
    await expect(useCase.execute(input)).rejects.toThrow('Account not found.');
  });

  it('deve verificar se conta que esta aceitando a corrida é um motorista', async () => {
    const passagerAccountId = '79a3baf5-7ad5-41e4-9088-e52a1caba2f1';
    rideData.driverId = passagerAccountId;
    const input = rideData;
    await expect(useCase.execute(input)).rejects.toThrow('Account is not a driver\'s.');
  });

  it('para aceitar corrida deve estar com status requested', async () => {
    const ride = await rideRepository.saveRide(Ride.createRide(
      '382d8d91-34b8-4118-a294-3c22847f48f5',
      '79a3baf5-7ad5-41e4-9088-e52a1caba2f1',
      'accepted',
      10,
      10,
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543,
      nowToISOString()
    ));
    rideData.rideId = ride.id;
    const input = rideData;
    await expect(useCase.execute(input)).rejects.toThrow('Invalid ride to accept.');
  });

  it('não deve existir corrida em status de progresso', async () => {
    await rideRepository.saveRide(Ride.createRide(
      '382d8d91-34b8-4118-a294-3c22847f48f5',
      '79a3baf5-7ad5-41e4-9088-e52a1caba2f1',
      'in_progress',
      10,
      10,
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543,
      nowToISOString()
    ));
    const input = rideData;
    await expect(useCase.execute(input)).rejects.toThrow('Ride already accepted or in progress.');
  });

  it('não deve existir corrida em status de aceita', async () => {
    await rideRepository.saveRide(Ride.createRide(
      '382d8d91-34b8-4118-a294-3c22847f48f5',
      '79a3baf5-7ad5-41e4-9088-e52a1caba2f1',
      'accepted',
      10,
      10,
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543,
      nowToISOString()
    ));
    const input = rideData;
    await expect(useCase.execute(input)).rejects.toThrow('Ride already accepted or in progress.');
  });

  it('deve aceitar a corrida', async () => {
    const ride = await rideRepository.saveRide(Ride.createRide(
      '382d8d91-34b8-4118-a294-3c22847f48f5',
      '79a3baf5-7ad5-41e4-9088-e52a1caba2f1',
      'requested',
      10,
      10,
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543,
      nowToISOString()
    ));
    rideData.rideId = ride.id;
    const input = rideData;
    const result = await useCase.execute(input);
    expect(result).toBeUndefined();
  });
});