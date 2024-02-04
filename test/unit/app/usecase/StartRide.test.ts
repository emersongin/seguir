import RideRepository from '../../../../src/infra/repository/RideRepository';
import AccountRepository from '../../../../src/infra/repository/AccountRepository';
import MemoryRideRepository from '../../../../src/infra/repository/MemoryRideRepository';
import MemoryAccountRepository from '../../../../src/infra/repository/MemoryAccountRepository';
import StartRide from '../../../../src/app/usecase/StartRide';
import { nowToISOString } from '../../../../src/infra/helpers/dates';
import Ride from '../../../../src/domain/entity/Ride';

describe('testes para caso de uso de iniciar corrida', () => {
  let rideRepository: RideRepository;
  let accountRepository: AccountRepository;
  let useCase: StartRide;
  let rideData: {
    rideId: string;
  };

  beforeEach(async () => {
    rideRepository = new MemoryRideRepository();
    const ride = await rideRepository.saveRide(Ride.createRide(
      'passengerAccountId',
      -23.56168,
      -46.62543,
      -23.56168,
      -46.62543
    ));
    accountRepository = new MemoryAccountRepository();
    useCase = new StartRide(rideRepository, accountRepository);
    rideData = {
      rideId: ride.id,
    };
  });

  it('deve iniciar corrida', async () => {
    const { rideId } = rideData;
    const ride = await rideRepository.findRideById(rideId);
    ride.acceptDriver('driverAccountId');
    await rideRepository.updateRide(ride);
    const input = rideData;
    const output = await useCase.execute(input);
    expect(output).toBeUndefined();
  });

  it('deve lançar erro se a corrida não existir', async () => {
    const input = {
      rideId: 'invalid_id',
    };
    await expect(useCase.execute(input)).rejects.toThrow('Ride not found.');
  });

  it('deve lançar erro se status de corrida estiver diferente de "accepted"', async () => {
    const input = rideData;
    await expect(useCase.execute(input)).rejects.toThrow('Ride already started.');
  });
});