import MemoryAccountRepository from '../../../../src/infra/repository/MemoryAccountRepository';
import AccountRepository from '../../../../src/infra/repository/AccountRepository';
import GetAccount from '../../../../src/app/usecase/GetAccount';
import Account from '../../../../src/domain/entity/Account';

describe('testes para caso de uso de buscar conta', () => {
  let accountRepository: AccountRepository;
  let useCase: GetAccount;
  let accountData: {
    accountId: string
  };

  beforeEach(async () => {
    accountRepository = new MemoryAccountRepository();
    const driverAccount = await accountRepository.saveAccount(Account.createAccount(
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
      accountId: driverAccount.id
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
    accountData.accountId = 'invalid_id';
    const input = accountData;
    await expect(useCase.execute(input)).rejects.toThrow('Account not found.');
  });
});
