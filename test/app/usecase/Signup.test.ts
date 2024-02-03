import AccountRepository from '../../../src/infra/repository/AccountRepository';
import MemoryAccountRepository from '../../../src/infra/repository/MemoryAccountRepository';
import Signup from '../../../src/app/usecase/Signup';

describe('testes para função de inscrever-se', () => {
  let accountRepository: AccountRepository;
  let useCase: Signup;
  let accoutData: {
    name: string;
    email: string;
    password: string;
    cpf: string;
    isDriver: boolean;
    isPassenger: boolean;
    carPlate: string | null;
  };

  beforeEach(() => {
    accountRepository = new MemoryAccountRepository();
    useCase = new Signup(accountRepository);
    accoutData = {
      name: 'Nome de Usuário Valido',
      email: 'email_de_usuario_valido@hotmail.com',
      password: 'senha_valida',
      cpf: '649.731.080-06',
      isDriver: false,
      isPassenger: false,
      carPlate: null
    };
  });

  it('efetuar inscrição como motorista!', async () => {
    accoutData.isDriver = true;
    accoutData.carPlate = 'ABC1234';
    const input = accoutData;
    const output = await useCase.execute(input);
    expect(output).toHaveProperty('accountId');
  });

  it('efetuar inscrição como passageiro!', async () => {
    accoutData.isPassenger = true;
    accoutData.carPlate = null;
    const input = accoutData;
    const output = await useCase.execute(input);
    expect(output).toHaveProperty('accountId');
  });

  it('não efetuar inscrição de conta existente!', async () => {
    accoutData.email = 'joao@hotmail.com';
    const input = accoutData;
    await expect(useCase.execute(input)).rejects.toThrow('account already exists.');
  });

  it('não efetuar inscrição com nome inválido!', async () => {
    accoutData.name = '';
    const input = accoutData;
    await expect(useCase.execute(input)).rejects.toThrow('Invalid user name.');
  });

  it('não efetuar inscrição com email inválido!', async () => {
    accoutData.email = '';
    const input = accoutData;
    await expect(useCase.execute(input)).rejects.toThrow('Invalid email.');
  });

  it('não efetuar inscrição com cpf inválido!', async () => {
    accoutData.cpf = '';
    const input = accoutData;
    await expect(useCase.execute(input)).rejects.toThrow('Invalid cpf.');
  });

  it('não efetuar inscrição de motorista com placa inválida!', async () => {
    accoutData.isDriver = true;
    accoutData.carPlate = 'ABC_1234';
    const input = accoutData;
    await expect(useCase.execute(input)).rejects.toThrow('Invalid car plate.');
  });

  it('não efetuar inscrição de conta sem password!', async () => {
    accoutData.password = '';
    const input = accoutData;
    await expect(useCase.execute(input)).rejects.toThrow('Invalid password.');
  });
});