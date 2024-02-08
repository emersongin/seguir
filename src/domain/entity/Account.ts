import Cpf from '../valueobject/Cpf';
import Name from '../valueobject/Name';
import Email from '../valueobject/Email';
import CarPlate from '../valueobject/CarPlate';

export default class Account {
  private name: Name;
  private email: Email;
  private cpf: Cpf;
  private carPlate: CarPlate | null = null;

  private constructor(
    readonly id: string | null,
    name: string,
    email: string,
    readonly password: string,
    cpf: string,
    readonly isDriver: boolean,
    readonly isPassenger: boolean,
    carPlate: string | null
  ) {
    this.name = new Name(name);
    this.email = new Email(email);
    if (this.isInvalidPassword(password)) throw new Error('Invalid password.');
		this.cpf = new Cpf(cpf);
    if (isDriver && carPlate) this.carPlate = new CarPlate(carPlate);
  }

  isInvalidPassword(password: string): boolean {
    return !(password || password.length > 0);
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

  getCarPlate(): string | null {
    return this.carPlate?.getValue() || null;
  }
}