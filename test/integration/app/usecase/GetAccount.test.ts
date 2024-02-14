import AccountRepositoryMemory from '../../../../src/infra/repository/AccountRepositoryMemory';
import AccountRepository from '../../../../src/infra/repository/AccountRepository';
import GetAccount from '../../../../src/app/usecase/GetAccount';
import Account from '../../../../src/domain/entity/Account';
import SQLDataBaseGatewayPGP from '../../../../src/infra/gateway/SQLDataBaseGatewayPGP';
import SQLDataBaseGateway from '../../../../src/infra/gateway/SQLDataBaseGateway';
import AccountRepositoryDatabase from '../../../../src/infra/repository/AccountRepositoryDatabase';

describe('testes para caso de uso de buscar conta', () => {
  let accountRepository: AccountRepository;
  let useCase: GetAccount;
  let accountData: {
    accountId: string
  };
  let database: SQLDataBaseGateway;

  beforeAll(async () => {
    database = new SQLDataBaseGatewayPGP();
    await database.connect();
  });

  afterAll(async () => {
    database.query('DELETE FROM account');
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
    useCase = new GetAccount(accountRepository);
    accountData = {
      accountId: driverAccount.id || ''
    };
  });

  it('deve retornar conta se existir', async () => {
    const input = accountData;
    const output = await useCase.execute(input);
    expect(output).toHaveProperty('accountId');
    expect(output).toHaveProperty('accountName');
    expect(output).toHaveProperty('accountEmail');
    expect(output).toHaveProperty('accountCpf');
    expect(output).toHaveProperty('accountIsDriver');
    expect(output).toHaveProperty('accountIsPassenger');
    expect(output).toHaveProperty('accountCarPlate');
  });

  it('deve lançar erro se conta não existir', async () => {
    accountData.accountId = '550e8400-e29b-41d4-a716-446655440000';
    const input = accountData;
    await expect(useCase.execute(input)).rejects.toThrow('Account not found.');
  });
});
