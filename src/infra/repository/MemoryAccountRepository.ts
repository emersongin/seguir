import Account from '../../domain/entity/Account';
import AccountRepository from './AccountRepository';
import crypto from 'crypto';

export default class MemoryAccountRepository implements AccountRepository {
  private accounts: {
    id: string;
    name: string;
    email: string;
    password: string;
    cpf: string;
    isDriver: boolean;
    isPassenger: boolean;
    carPlate: string | null;
  }[] = [
    {
      id: '382d8d91-34b8-4118-a294-3c22847f48f5',
      name: 'João Silva',
      email: 'joao@hotmail.com',
      password: '12@345@6',
      cpf: '649.731.080-06',
      isDriver: true,
      isPassenger: false,
      carPlate: 'ABC1234'
    },
    {
      id: '79a3baf5-7ad5-41e4-9088-e52a1caba2f1',
      name: 'Maria Silva',
      email: 'maria@hotmail.com',
      password: '12@345@6',
      cpf: '649.731.080-06',
      isDriver: false,
      isPassenger: true,
      carPlate: null
    },
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
    const newAccount = Account.createAccount(
      account.name,
      account.email,
      account.password,
      account.cpf,
      account.isDriver,
      account.isPassenger,
      account.carPlate,
      id
    );
    this.accounts.push({
      id,
      name: newAccount.name,
      email: newAccount.email,
      password: newAccount.password,
      cpf: newAccount.cpf,
      isDriver: newAccount.isDriver,
      isPassenger: newAccount.isPassenger,
      carPlate: newAccount.carPlate
    });
    return newAccount;
  }

  async findAccountByEmail(email: string): Promise<Account | undefined> {
    const accountData = this.accounts.find(account => account.email === email);
    if (!accountData) return undefined;
    return Account.createAccount(
      accountData.name,
      accountData.email,
      accountData.password,
      accountData.cpf,
      accountData.isDriver,
      accountData.isPassenger,
      accountData.carPlate,
      accountData.id
    );
  }

  async findAccountById(accountId: string): Promise<Account | undefined> {
    const accountData = this.accounts.find(account => account.id === accountId);
    if (!accountData) return undefined;
    return Account.createAccount(
      accountData.name,
      accountData.email,
      accountData.password,
      accountData.cpf,
      accountData.isDriver,
      accountData.isPassenger,
      accountData.carPlate,
      accountData.id
    );
  }
}