import Cpf from '../valueobject/Cpf';
import Name from '../valueobject/Name';
import Email from '../valueobject/Email';
import CarPlate from '../valueobject/CarPlate';
import Password from '../valueobject/Password';
import crypto from 'crypto';

export default class Account {
  private name: Name;
  private email: Email;
  private cpf: Cpf;
  private carPlate: CarPlate | null = null;
  private password: Password;

  private constructor(
    readonly id: string,
    name: string,
    email: string,
    password: string,
    cpf: string,
    readonly isDriver: boolean,
    readonly isPassenger: boolean,
    carPlate: string | null
  ) {
    this.id = id;
    this.name = new Name(name);
    this.email = new Email(email);
    this.password = new Password(password);
		this.cpf = new Cpf(cpf);
    if (isDriver && carPlate) this.carPlate = new CarPlate(carPlate);
  }

  static create(
    name: string,
    email: string,
    password: string,
    cpf: string,
    isDriver: boolean,
    isPassenger: boolean,
    carPlate: string | null
  ): Account {
    return new Account(
      crypto.randomUUID(), 
      name, 
      email, 
      password,
      cpf, 
      isDriver, 
      isPassenger, 
      carPlate
    );
  }

  static restore(
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

  getId(): string {
    return this.id;
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

  getPassword(): string {
    return this.password.getValue();
  }
}