import SignupUseCase from '../src/app/usecase/SignupUseCase';
import SQLAccountDAO from '../src/infra/dao/SQLAccountDAO';
import MemoryAccountDAO from '../src/infra/dao/MemoryAccountDAO';

describe('testes para função de inscrever-se', () => {
  it('efetuar inscrição como motorista!', async () => {
    const accountDao = new MemoryAccountDAO();
    const useCase = new SignupUseCase(accountDao);
    const input = {
      name: 'João Silva Novo',
      email: 'joao_novo@hotmail.com',
      cpf: '649.731.080-06',
      isDriver: true,
      isPassenger: false,
      carPlate: 'ABC1234'
    };
    const output = await useCase.execute(input);
    expect(output).toHaveProperty('accountId');
  });

  it('efetuar inscrição como passageiro!', async () => {
    const accountDao = new MemoryAccountDAO();
    const useCase = new SignupUseCase(accountDao);
    const input = {
      name: 'João Silva Novo',
      email: 'joao_novo@hotmail.com',
      cpf: '649.731.080-06',
      isDriver: false,
      isPassenger: true,
      carPlate: null
    };
    const output = await useCase.execute(input);
    expect(output).toHaveProperty('accountId');
  });

  it('não efetuar inscrição com nome inválido!', async () => {
    const accountDao = new MemoryAccountDAO();
    const useCase = new SignupUseCase(accountDao);
    const input = {
      name: '',
      email: 'joao_novo@hotmail.com',
      cpf: '649.731.080-06',
      isDriver: false,
      isPassenger: true,
      carPlate: null
    };
    await expect(useCase.execute(input)).rejects.toThrow('Invalid user name.');
  });
  
  it('não efetuar inscrição com email inválido!', async () => {
    const accountDao = new MemoryAccountDAO();
    const useCase = new SignupUseCase(accountDao);
    const input = {
      name: 'João Silva Novo',
      email: '',
      cpf: '649.731.080-06',
      isDriver: false,
      isPassenger: true,
      carPlate: null
    };
    await expect(useCase.execute(input)).rejects.toThrow('Invalid email.');
  });

  it('não efetuar inscrição com cpf inválido!', async () => {
    const accountDao = new MemoryAccountDAO();
    const useCase = new SignupUseCase(accountDao);
    const input = {
      name: 'João Silva Novo',
      email: 'joao_novo@hotmail.com',
      cpf: '',
      isDriver: false,
      isPassenger: true,
      carPlate: null
    };
    await expect(useCase.execute(input)).rejects.toThrow('Invalid cpf.');
  });

  it('não efetuar inscrição de conta existente!', async () => {
    const accountDao = new MemoryAccountDAO();
    const useCase = new SignupUseCase(accountDao);
    const input = {
      name: 'João Silva',
      email: 'joao@hotmail.com',
      cpf: '649.731.080-06',
      isDriver: true,
      isPassenger: false,
      carPlate: 'ABC1234'
    };
    await expect(useCase.execute(input)).rejects.toThrow('account already exists.');
  });

  it('não efetuar inscrição de motorista com placa inválida!', async () => {
    const accountDao = new MemoryAccountDAO();
    const useCase = new SignupUseCase(accountDao);
    const input = {
      name: 'João Silva Novo',
      email: 'joao_novo@hotmail.com',
      cpf: '649.731.080-06',
      isDriver: true,
      isPassenger: false,
      carPlate: 'ABC_1234'
    };
    await expect(useCase.execute(input)).rejects.toThrow('invalid car plate.');
  });
});