export default interface AccountRepository {
  save(account: Account): Promise<Account>;
  findAccountByEmail(email: string): Promise<Account | undefined>;
  findAccountById(accountId: string): Promise<Account | undefined>;
}