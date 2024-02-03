export default interface AccountRepository {
  findAccountByEmail(email: string): Promise<Account | undefined>;
  save(account: Account): Promise<Account>;
}