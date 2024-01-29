import crypto from "crypto";
import pgp from "pg-promise";
import { validateCpf } from "../../infra/helpers/validateCpf";
import InputSignupDto from '../dto/signup/input';
import OutputSignupDto from '../dto/signup/output';
import AccountDAO from '../../domain/dao/AccountDAO';

export default class SignupUseCase {
	constructor(readonly accountDao: AccountDAO) {}

	async execute (input: InputSignupDto): Promise<OutputSignupDto | Error> {
		const { name, email, cpf, isDriver, isPassenger, carPlate } = input;
		if (!name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error('Invalid user name.');
		if (!email.match(/^(.+)@(.+)$/)) throw new Error('Invalid email.');
		if (!validateCpf(cpf)) throw new Error('Invalid cpf.');
		const account = await this.accountDao.findAccountByEmail(email);
		if (account) throw new Error('account already exists.');
		if (isDriver) {
			if (carPlate && !carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error('invalid car plate.');
			const createAccount = await this.accountDao.createDriverAccount(name, email, cpf, carPlate);
			return createAccount;
		} else {
			const createAccount = await this.accountDao.createPassengerAccount(name, email, cpf);
			return createAccount;
		}
	}
}