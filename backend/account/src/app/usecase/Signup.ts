import AccountRepository from '../../infra/repository/AccountRepository';
import Account from '../../domain/entity/Account';

export default class Signup {
	constructor(
		private readonly accountRepository: AccountRepository
	) {}

	async execute (input: InputDto): Promise<OutputDto> {
		const { name, email, password, cpf, isDriver, isPassenger, carPlate, creditCardToken } = input;
		const accountFinded = await this.accountRepository.getByEmail(email);
		if (accountFinded) throw new Error('Account already exists.');
		const newAccount = Account.create(
			name, 
			email, 
			password, 
			cpf, 
			isDriver, 
			isPassenger, 
			carPlate,
			creditCardToken
		);
		const accountCreated = await this.accountRepository.save(newAccount);
		return {
			accountId: accountCreated.id
		};
	}
}

type InputDto = {
  name: string;
  email: string;
	password: string;
  cpf: string;
  isDriver: boolean;
  isPassenger: boolean;
  carPlate: string | null;
	creditCardToken: string | null;
};

type OutputDto = {
  accountId: string;
};