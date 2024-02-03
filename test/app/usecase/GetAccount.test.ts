import MemoryAccountRepository from '../../../src/infra/repository/MemoryAccountRepository';
import AccountRepository from '../../../src/infra/repository/AccountRepository';
import GetAccount from '../../../src/app/usecase/GetAccount';

describe('testes para caso de uso de buscar conta', () => {
  let accountRepository: AccountRepository;
  let useCase: GetAccount;
  let accountData: {
    accountId: string
  };

  beforeEach(() => {
    accountRepository = new MemoryAccountRepository();
    useCase = new GetAccount(accountRepository);
    accountData = {
      accountId: '382d8d91-34b8-4118-a294-3c22847f48f5'
    };
  });

  it('buscar conta existente!', async () => {
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

  it('deve retornar um erro ao tentar buscar uma conta inexistente', async () => {
    accountData.accountId = 'invalid_id';
    const input = accountData;
    await expect(useCase.execute(input)).rejects.toThrow('Account not found.');
  });
});
