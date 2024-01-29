import crypto from 'crypto';
import AccountDAO from '../../domain/dao/AccountDAO';
import Account from '../../domain/entity/Account';

export default class MemoryAccountDAO implements AccountDAO {
  _accounts: Account[] = [
    {
      accountId: '382d8d91-34b8-4118-a294-3c22847f48f5',
      name: 'João Silva',
      email: 'joao@hotmail.com',
      cpf: '649.731.080-06',
      isDriver: true,
      isPassenger: false,
      carPlate: 'ABC1234'
    },
    {
      accountId: '79a3baf5-7ad5-41e4-9088-e52a1caba2f1',
      name: 'Maria Silva',
      email: 'maria@hotmail.com',
      cpf: '649.731.080-06',
      isDriver: false,
      isPassenger: true,
      carPlate: null
    }
  ];

  async findAccountByEmail(email: string): Promise<Account | null> {
    const account = this._accounts.find(acc => acc.email === email);
    return account || null;
  }

  async findAccountById(accountId: string): Promise<Account | null> {
    const account = await this._accounts.find(acc => acc.accountId === accountId);
    return account || null;
  }

  async createPassengerAccount(name: string, email: string, cpf: string): Promise<Account> {
    const id = crypto.randomUUID();
    const account = {
      accountId: id,
      name,
      email,
      cpf,
      isDriver: false,
      isPassenger: true,
      carPlate: null
    };
    await this._accounts.push(account);
    return account;
  }

  async createDriverAccount(name: string, email: string, cpf: string, carPlate: string | null): Promise<Account> {
    const id = crypto.randomUUID();
    const account = {
      accountId: id,
      name,
      email,
      cpf,
      isDriver: true,
      isPassenger: false,
      carPlate
    };
    await this._accounts.push(account);
    return account;
  }
}