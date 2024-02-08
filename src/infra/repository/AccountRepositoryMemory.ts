import Account from '../../domain/entity/Account';
import AccountRepository from './AccountRepository';
import crypto from 'crypto';

export default class AccountRepositoryMemory implements AccountRepository {
  private accounts: AccountData[] = [
    {
      id: '046ba3b6-9425-4a42-8f24-e793462e936a',
      name: 'Usuario com corrida ativa',
      email: 'usuario_com_corrida_ativa@hotmail.com',
      password: '12@345@6',
      cpf: '649.731.080-06',
      isDriver: false,
      isPassenger: true,
      carPlate: null
    }
  ];

  async saveAccount(account: Account): Promise<Account> {
    const id = crypto.randomUUID();
    this.accounts.push({
      id,
      name: account.getName(),
      email: account.getEmail(),
      password: account.password,
      cpf: account.getCpf(),
      isDriver: account.isDriver,
      isPassenger: account.isPassenger,
      carPlate: account.getCarPlate()
    });
    const newAccount = Account.restoreAccount(
      id,
      account.getName(),
      account.getEmail(),
      account.password,
      account.getCpf(),
      account.isDriver,
      account.isPassenger,
      account.getCarPlate(),
    );
    return newAccount;
  }

  async findAccountByEmail(email: string): Promise<Account | undefined> {
    const accountData = this.accounts.find(account => account.email === email);
    if (!accountData) return undefined;
    return Account.restoreAccount(
      accountData.id,
      accountData.name,
      accountData.email,
      accountData.password,
      accountData.cpf,
      accountData.isDriver,
      accountData.isPassenger,
      accountData.carPlate
    );
  }

  async findAccountById(accountId: string): Promise<Account | undefined> {
    const accountData = this.accounts.find(account => account.id === accountId);
    if (!accountData) return undefined;
    return Account.restoreAccount(
      accountData.id,
      accountData.name,
      accountData.email,
      accountData.password,
      accountData.cpf,
      accountData.isDriver,
      accountData.isPassenger,
      accountData.carPlate
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
};