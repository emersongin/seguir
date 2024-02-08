import Cpf from '../valueobject/Cpf';
import Name from '../valueobject/Name';
import Email from '../valueobject/Email';

export default class Account {
  private name: Name;
  private email: Email;
  private cpf: Cpf;

  private constructor(
    readonly id: string | null,
    name: string,
    email: string,
    readonly password: string,
    cpf: string,
    readonly isDriver: boolean,
    readonly isPassenger: boolean,
    readonly carPlate: string | null
  ) {
    this.name = new Name(name);
    this.email = new Email(email);
    if (this.isInvalidPassword(password)) throw new Error('Invalid password.');
		this.cpf = new Cpf(cpf);
    if (isDriver) {
			if (!carPlate || this.isInvalidCarPlate(carPlate)) throw new Error('Invalid car plate.');
		}
  }

  isInvalidPassword(password: string): boolean {
    return !(password || password.length > 0);
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

  getName(): string {
    return this.name.getValue();
  }

  getEmail(): string {
    return this.email.getValue();
  }

  getCpf(): string {
    return this.cpf.getValue();
  }
}