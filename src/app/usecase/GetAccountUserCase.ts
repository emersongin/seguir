
import InputGetAccountDto from '../dto/get-account/input';
import OutputGetAccountDto from '../dto/get-account/output';
import AccountDAO from '../../domain/dao/AccountDAO';

export default class GetAccountUserCase {
	constructor(private readonly accountDao: AccountDAO) {}

	async execute (input: InputGetAccountDto): Promise<OutputGetAccountDto | Error> {
    const { accountId } = input;
    const account = await this.accountDao.findAccountById(accountId);
    if (!account) {
      throw new Error('Account not found.');
    }
    return account;
  }
}