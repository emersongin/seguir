import AccountRepository from '../../infra/repository/AccountRepository';

export default class GetAccount {
	constructor(private readonly accountRepository: AccountRepository) {}

	async execute (input: InputDto): Promise<OutputDto> {
    const { accountId } = input;
    const account = await this.accountRepository.getById(accountId);
    if (!account) throw new Error('Account not found.');
    return {
      accountId: account.id,
      accountName: account.getName(),
      accountEmail: account.getEmail(),
      accountCpf: account.getCpf(),
      accountIsDriver: account.isDriver,
      accountIsPassenger: account.isPassenger,
      accountCarPlate: account.getCarPlate()
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