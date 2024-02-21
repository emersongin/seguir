import AccountRepository from '../../../../src/infra/repository/AccountRepository';
import Signup from '../../../../src/app/usecase/Signup';
import Account from '../../../../src/domain/entity/Account';
import SQLDataBaseGateway from '../../../../src/infra/gateway/SQLDataBaseGateway';
import SQLDataBaseGatewayPGP from '../../../../src/infra/gateway/SQLDataBaseGatewayPGP';
import AccountRepositoryDatabase from '../../../../src/infra/repository/AccountRepositoryDatabase';
import crypto from 'crypto';

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
    const driverAccount = await accountRepository.save(Account.create(
      'João Silva',
      'joao@hotmail.com',
      '12@345@6',
      '649.731.080-06',
      true,
      false,
      'ABC1234'
    ));
    if (!driverAccount) throw new Error('Account not found');
    useCase = new Signup(accountRepository);
    const uuid = crypto.randomUUID();
    accountData = {
      name: 'Nome de novo usuário',
      email: `test_${uuid}@hotmail.com`,
      password: 'senha_valida',
      cpf: '649.731.080-06',
      isDriver: false,
      isPassenger: true,
      carPlate: null
    };
  });

  it('deve efetuar inscrição como motorista', async () => {
    accountData.isDriver = true;
    accountData.carPlate = 'ABC1234';
    const input = accountData;
    const output = await useCase.execute(input);
    expect(output).toHaveProperty('accountId');
    if (!output.accountId) throw new Error('Account id not found');
    const account = await accountRepository.getById(output.accountId);
    if (!account) throw new Error('Account not found');
    expect(account.isDriver).toBe(true);
    expect(account.getCarPlate()).toBe('ABC1234');
  });

  it('deve efetuar inscrição como passageiro', async () => {
    accountData.isPassenger = true;
    accountData.carPlate = null;
    const input = accountData;
    const output = await useCase.execute(input);
    expect(output).toHaveProperty('accountId');
    if (!output.accountId) throw new Error('Account id not found');
    const account = await accountRepository.getById(output.accountId);
    if (!account) throw new Error('Account not found');
    expect(account.isPassenger).toBe(true);
    expect(account.getCarPlate()).toBe(null);
  });

  it('deve lançar error se email da conta já existir', async () => {
    accountData.email = 'joao@hotmail.com';
    const input = accountData;
    await expect(useCase.execute(input)).rejects.toThrow('Account already exists.');
  });

  it('deve lançar erro se inscrição estiver com nome inválido', async () => {
    accountData.name = '';
    const input = accountData;
    await expect(useCase.execute(input)).rejects.toThrow('Invalid user name.');
  });

  it('deve lançar erro se inscrição estiver com email inválido', async () => {
    accountData.email = '';
    const input = accountData;
    await expect(useCase.execute(input)).rejects.toThrow('Invalid email.');
  });

  it('deve lançar erro se inscrição estiver com cpf inválido', async () => {
    accountData.cpf = '';
    const input = accountData;
    await expect(useCase.execute(input)).rejects.toThrow('Invalid cpf.');
  });

  it('deve lançar erro se inscrição de motorista se estiver com placa inválida', async () => {
    accountData.isDriver = true;
    accountData.carPlate = 'ABC_1234';
    const input = accountData;
    await expect(useCase.execute(input)).rejects.toThrow('Invalid car plate.');
  });

  it('deve lançar erro se inscrição estiver sem password', async () => {
    accountData.password = '';
    const input = accountData;
    await expect(useCase.execute(input)).rejects.toThrow('Invalid password.');
  });
});