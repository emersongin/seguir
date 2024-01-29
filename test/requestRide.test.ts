import RequestRideUseCase from '../src/app/usecase/RequestRideUseCase';
import MemoryAccountDAO from '../src/infra/dao/MemoryAccountDAO';
import MemoryRideDAO from '../src/infra/dao/MemoryRideDAO';

describe('testes para função de solicitar corrida', () => {
  it('efetuar solicitação de corrida!', async () => {
    const input = {
      passengerId: '79a3baf5-7ad5-41e4-9088-e52a1caba2f1',
      fromLat: -23.56168,
      fromLong: -46.62543,
      toLat: -23.56168,
      toLong: -46.62543,
    };
    const accountDao = new MemoryAccountDAO();
    const rideDao = new MemoryRideDAO();
    const useCase = new RequestRideUseCase(accountDao, rideDao);
    const output = await useCase.execute(input);
    expect(output).toHaveProperty('rideId');
  });

  //deve verificar se o account_id tem is_passenger true
  it('deve verificar se o accountId é de passageiro', async () => {
    const input = {
      passengerId: '382d8d91-34b8-4118-a294-3c22847f48f5',
      fromLat: -23.56168,
      fromLong: -46.62543,
      toLat: -23.56168,
      toLong: -46.62543,
    };
    const accountDao = new MemoryAccountDAO();
    const rideDao = new MemoryRideDAO();
    const useCase = new RequestRideUseCase(accountDao, rideDao);
    await expect(useCase.execute(input)).rejects.toThrow('invalid passenger id.');
  });
});