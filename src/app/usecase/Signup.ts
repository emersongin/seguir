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
		const accountCreated = await this.accountRepository.save(newAccount);
		return {
			accountId: accountCreated.id
		};
	}
}

export interface InputDto {
  name: string;
  email: string;
	password: string;
  cpf: string;
  isDriver: boolean;
  isPassenger: boolean;
  carPlate: string | null;
};

export interface OutputDto {
  accountId: string;
};