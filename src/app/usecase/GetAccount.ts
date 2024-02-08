import AccountRepository from '../../infra/repository/AccountRepository';

export default class GetAccount {
	constructor(private readonly accountRepository: AccountRepository) {}

	async execute (input: InputDto): Promise<OutputDto | Error> {
    const { accountId } = input;
    const account = await this.accountRepository.findAccountById(accountId);
    if (!account || !account.id) throw new Error('Account not found.');
    return {
      accountId: account.id,
      accountName: account.name,
      accountEmail: account.email,
      accountCpf: account.getCpf(),
      accountIsDriver: account.isDriver,
      accountIsPassenger: account.isPassenger,
      accountCarPlate: account.carPlate
    };
  }
}

type InputDto = {
  accountId: string;
};

type OutputDto = {
  accountId: string;
  accountName: string;
  accountEmail: string;
  accountCpf: string;
  accountIsDriver: boolean;
  accountIsPassenger: boolean;
  accountCarPlate: string | null;
};