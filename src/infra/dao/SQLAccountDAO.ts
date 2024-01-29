import SQLDataBaseGateway from '../gateway/SQLDataBaseGateway';
import crypto from 'crypto';
import AccountDAO from '../../domain/dao/AccountDAO';
import Account from '../../domain/entity/Account';

export default class SQLAccountDAO implements AccountDAO {
  constructor(readonly db: SQLDataBaseGateway) {}

  async findAccountByEmail(email: string): Promise<Account | null> {
    const [account] = await this.db.query("select * from account where email = $1", [email]);
    if (!account) return null; 
    return {
      accountId: account.account_id,
      name: account.name,
      email: account.email,
      cpf: account.cpf,
      isDriver: account.is_driver,
      isPassenger: account.is_passenger,
      carPlate: account.car_plate
    };
  }

  async findAccountById(accountId: string): Promise<Account | null> {
    const [account] = await this.db.query("select * from account where account_id = $1", [accountId]);
    if (!account) return null; 
    return {
      accountId: account.account_id,
      name: account.name,
      email: account.email,
      cpf: account.cpf,
      isDriver: account.is_driver,
      isPassenger: account.is_passenger,
      carPlate: account.car_plate
    };
  }

  async createPassengerAccount(name: string, email: string, cpf: string): Promise<Account> {
    const id = crypto.randomUUID();
    await this.db.query("insert into account (account_id, name, email, cpf, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6)", [id, name, email, cpf, true, false]);
    const account = {
      accountId: id,
      name,
      email,
      cpf,
      isDriver: false,
      isPassenger: true,
      carPlate: null
    };
    return account;
  }

  async createDriverAccount(name: string, email: string, cpf: string, carPlate: string | null): Promise<Account> {
    const id = crypto.randomUUID();
    await this.db.query("insert into account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [id, name, email, cpf, carPlate, false, true]);
    const account = {
      accountId: id,
      name,
      email,
      cpf,
      isDriver: true,
      isPassenger: false,
      carPlate
    };
    return account;
  }
}