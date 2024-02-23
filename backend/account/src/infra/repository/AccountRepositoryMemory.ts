import Account from '../../domain/entity/Account';
import AccountRepository from './AccountRepository';

export default class AccountRepositoryMemory implements AccountRepository {
  private accounts: AccountData[] = [];

  async save(account: Account): Promise<Account> {
    this.accounts.push({
      id: account.getId(),
      name: account.getName(),
      email: account.getEmail(),
      password: account.getPassword(),
      cpf: account.getCpf(),
      isDriver: account.isDriver,
      isPassenger: account.isPassenger,
      carPlate: account.getCarPlate(),
      creditCardToken: account.getCreditCardToken()
    });
    const newAccount = Account.restore(
      account.getId(),
      account.getName(),
      account.getEmail(),
      account.getPassword(),
      account.getCpf(),
      account.isDriver,
      account.isPassenger,
      account.getCarPlate(),
      account.getCreditCardToken()
    );
    return newAccount;
  }

  async getByEmail(email: string): Promise<Account | undefined> {
    const accountData = this.accounts.find(account => account.email === email);
    if (!accountData) return undefined;
    return Account.restore(
      accountData.id,
      accountData.name,
      accountData.email,
      accountData.password,
      accountData.cpf,
      accountData.isDriver,
      accountData.isPassenger,
      accountData.carPlate,
      accountData.creditCardToken
    );
  }

  async getById(accountId: string): Promise<Account | undefined> {
    const accountData = this.accounts.find(account => account.id === accountId);
    if (!accountData) return undefined;
    return Account.restore(
      accountData.id,
      accountData.name,
      accountData.email,
      accountData.password,
      accountData.cpf,
      accountData.isDriver,
      accountData.isPassenger,
      accountData.carPlate,
      accountData.creditCardToken
    );
  }
}

type AccountData = {
  id: string;
  name: string;
  email: string;
  password: string;
  cpf: string;
  isDriver: boolean;
  isPassenger: boolean;
  carPlate: string | null;
  creditCardToken: string | null;
};