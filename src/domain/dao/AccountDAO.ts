import Account from '../entity/Account';

export default interface AccountDAO {
  findAccountByEmail(email: string): Promise<Account | null>;
  findAccountById(accountId: string): Promise<Account | null>;
  createPassengerAccount(name: string, email: string, cpf: string): Promise<Account>;
  createDriverAccount(name: string, email: string, cpf: string, carPlate: string | null): Promise<Account>;
}