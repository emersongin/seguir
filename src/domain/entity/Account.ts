import { validateCpf } from '../../infra/helpers/validateCpf';

export default class Account {
  private constructor(
    readonly id: string | null,
    readonly name: string,
    readonly email: string,
    readonly password: string,
    readonly cpf: string,
    readonly isDriver: boolean,
    readonly isPassenger: boolean,
    readonly carPlate: string | null
  ) {
    if (!this.validName(name)) throw new Error('Invalid user name.');
		if (!this.validEmail(email)) throw new Error('Invalid email.');
    if (!this.validPassword(password)) throw new Error('Invalid password.');
		if (!this.validCpf(cpf)) throw new Error('Invalid cpf.');
    if (isDriver && !isPassenger) {
			if (!carPlate || !this.validCarPlate(carPlate)) throw new Error('Invalid car plate.');
		}
  }

  validName(name: string): boolean {
    return !!name.match(/[a-zA-Z] [a-zA-Z]+/);
  }

  validEmail(email: string): boolean {
    return !!email.match(/^(.+)@(.+)$/) ? true : false;
  }

  validPassword(password: string): boolean {
    return !!(password || password.length > 0);
  }

  validCpf(cpf: string): boolean {
    return validateCpf(cpf);
  }

  validCarPlate(carPlate: string): boolean {
    return !!carPlate.match(/[A-Z]{3}[0-9]{4}/);
  }

  static createAccount(
    name: string,
    email: string,
    password: string,
    cpf: string,
    isDriver: boolean,
    isPassenger: boolean,
    carPlate: string | null
  ): Account {
    return new Account(
      null, 
      name, 
      email, 
      password,
      cpf, 
      isDriver, 
      isPassenger, 
      carPlate
    );
  }

  static createAccountWithId(
    id: string,
    name: string,
    email: string,
    password: string,
    cpf: string,
    isDriver: boolean,
    isPassenger: boolean,
    carPlate: string | null
  ): Account {
    return new Account(
      id, 
      name, 
      email, 
      password,
      cpf, 
      isDriver, 
      isPassenger, 
      carPlate
    );
  }
}