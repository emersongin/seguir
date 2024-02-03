import AccountRepository from '../../../src/infra/repository/AccountRepository';
import MemoryAccountRepository from '../../../src/infra/repository/MemoryAccountRepository';
import Signup from '../../../src/app/usecase/Signup';

describe('testes para o caso de uso de se inscrever', () => {
  let accountRepository: AccountRepository;
  let useCase: Signup;
  let accountData: {
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
    accountData = {
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
    accountData.isDriver = true;
    accountData.carPlate = 'ABC1234';
    const input = accountData;
    const output = await useCase.execute(input);
    expect(output).toHaveProperty('accountId');
  });

  it('efetuar inscrição como passageiro!', async () => {
    accountData.isPassenger = true;
    accountData.carPlate = null;
    const input = accountData;
    const output = await useCase.execute(input);
    expect(output).toHaveProperty('accountId');
  });

  it('não efetuar inscrição de conta existente!', async () => {
    accountData.email = 'joao@hotmail.com';
    const input = accountData;
    await expect(useCase.execute(input)).rejects.toThrow('account already exists.');
  });

  it('não efetuar inscrição com nome inválido!', async () => {
    accountData.name = '';
    const input = accountData;
    await expect(useCase.execute(input)).rejects.toThrow('Invalid user name.');
  });

  it('não efetuar inscrição com email inválido!', async () => {
    accountData.email = '';
    const input = accountData;
    await expect(useCase.execute(input)).rejects.toThrow('Invalid email.');
  });

  it('não efetuar inscrição com cpf inválido!', async () => {
    accountData.cpf = '';
    const input = accountData;
    await expect(useCase.execute(input)).rejects.toThrow('Invalid cpf.');
  });

  it('não efetuar inscrição de motorista com placa inválida!', async () => {
    accountData.isDriver = true;
    accountData.carPlate = 'ABC_1234';
    const input = accountData;
    await expect(useCase.execute(input)).rejects.toThrow('Invalid car plate.');
  });

  it('não efetuar inscrição de conta sem password!', async () => {
    accountData.password = '';
    const input = accountData;
    await expect(useCase.execute(input)).rejects.toThrow('Invalid password.');
  });
});