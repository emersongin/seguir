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
    ),
    Account.createAccountWithId(
      '79a3baf5-7ad5-41e4-9088-e52a1caba2f1',
      'Maria Silva',
      'maria@hotmail.com',
      '12@345@6',
      '649.731.080-06',
      false,
      true,
      null
    ),
    Account.createAccountWithId(
      '046ba3b6-9425-4a42-8f24-e793462e936a',
      'Usuario com corrida ativa',
      'usuario_com_corrida_ativa@hotmail.com',
      '12@345@6',
      '649.731.080-06',
      false,
      true,
      null
    )
  ];

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

  async findAccountByEmail(email: string): Promise<Account | undefined> {
    return this.accounts.find(account => account.email === email);
  }

  async findAccountById(accountId: string): Promise<Account | undefined> {
    return this.accounts.find(account => account.id === accountId);
  }
}