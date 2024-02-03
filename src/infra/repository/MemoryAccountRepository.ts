import Account from '../../domain/entity/Account';
import AccountRepository from './AccountRepository';
import crypto from 'crypto';

export default class MemoryAccountRepository implements AccountRepository {
  private accounts: Account[] = [
    Account.createAccountWithId(
      '382d8d91-34b8-4118-a294-3c22847f48f5',
      'João Silva',
      'joao@hotmail.com',
      '12@345@6',
      '649.731.080-06',
      true,
      false,
      'ABC1234'
    )
  ];

  async findAccountByEmail(email: string): Promise<Account | undefined> {
    return this.accounts.find(account => account.email === email);
  }

  async save(account: Account): Promise<Account> {
    const id = crypto.randomUUID();
    const newAccount = Account.createAccountWithId(
      id,
      account.name,
      account.email,
      account.password,
      account.cpf,
      account.isDriver,
      account.isPassenger,
      account.carPlate
    );
    this.accounts.push(newAccount);
    return newAccount;
  }
}