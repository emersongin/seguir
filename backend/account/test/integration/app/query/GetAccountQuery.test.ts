import AccountRepository from '../../../../src/infra/repository/AccountRepository';
import Account from '../../../../src/domain/entity/Account';
import AccountRepositoryDatabase from '../../../../src/infra/repository/AccountRepositoryDatabase';
import DatabaseConnection from '../../../../src/infra/database/DatabaseConnection';
import PgPromiseAdapter from '../../../../src/infra/database/PgPromiseAdapter';
import GetAccountQuery from '../../../../src/app/query/GetAccountQuery';

describe('testes para caso de uso de buscar conta', () => {
  let accountRepository: AccountRepository;
  let useCase: GetAccountQuery;
  let accountData: {
    accountId: string
  };
  let database: DatabaseConnection;

  beforeAll(async () => {
    database = new PgPromiseAdapter();
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
      'ABC1234',
      null
    ));
    if (!driverAccount) throw new Error('Account not found');
    useCase = new GetAccountQuery(database);
    accountData = {
      accountId: driverAccount.id
    };
  });

  it('deve retornar conta se existir', async () => {
    const { accountId } = accountData;
    const output = await useCase.execute(accountId);
    expect(output).toHaveProperty('accountId');
    expect(output).toHaveProperty('accountName');
    expect(output).toHaveProperty('accountEmail');
    expect(output).toHaveProperty('accountCpf');
    expect(output).toHaveProperty('accountIsDriver');
    expect(output).toHaveProperty('accountIsPassenger');
    expect(output).toHaveProperty('accountCarPlate');
    expect(output).toHaveProperty('accountCreditCardToken');
  });

  it('deve lançar erro se conta não existir', async () => {
    const accountId = '550e8400-e29b-41d4-a716-446655440000';
    await expect(useCase.execute(accountId)).rejects.toThrow('Account not found.');
  });
});
