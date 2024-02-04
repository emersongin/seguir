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
    if (this.isInvalidName(name)) throw new Error('Invalid user name.');
		if (this.isInvalidEmail(email)) throw new Error('Invalid email.');
    if (this.isInvalidPassword(password)) throw new Error('Invalid password.');
		if (this.isInvalidCpf(cpf)) throw new Error('Invalid cpf.');
    if (isDriver) {
			if (!carPlate || this.isInvalidCarPlate(carPlate)) throw new Error('Invalid car plate.');
		}
  }

  isInvalidName(name: string): boolean {
    return !name.match(/[a-zA-Z] [a-zA-Z]+/);
  }

  isInvalidEmail(email: string): boolean {
    return !email.match(/^(.+)@(.+)$/) ? true : false;
  }

  isInvalidPassword(password: string): boolean {
    return !(password || password.length > 0);
  }

  isInvalidCpf(cpf: string): boolean {
    return !validateCpf(cpf);
  }

  isInvalidCarPlate(carPlate: string): boolean {
    return !carPlate.match(/[A-Z]{3}[0-9]{4}/);
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

  static restoreAccount(
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