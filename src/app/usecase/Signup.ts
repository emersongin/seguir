import { validateCpf } from "../../infra/helpers/validateCpf";
import AccountRepository from '../../infra/repository/AccountRepository';
import Account from '../../domain/entity/Account';

export default class Signup {
	constructor(
		private readonly accountRepository: AccountRepository
	) {}

	async execute (input: InputDto): Promise<OutputDto | Error> {
		const { name, email, password, cpf, isDriver, isPassenger, carPlate } = input;
		const accountFinded = await this.accountRepository.findAccountByEmail(email);
		if (accountFinded) throw new Error('Account already exists.');
		const newAccount = Account.createAccount(name, email, password, cpf, isDriver, isPassenger, carPlate);
		const accountCreated = await this.accountRepository.saveAccount(newAccount);
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
};

type OutputDto = {
  accountId: string;
};