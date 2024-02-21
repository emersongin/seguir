import Account from '../../domain/entity/Account';

export default interface AccountRepository {
  save(account: Account): Promise<Account>;
  getByEmail(email: string): Promise<Account | undefined>;
  getById(accountId: string): Promise<Account | undefined>;
}