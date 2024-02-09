import Account from '../../domain/entity/Account';
import AccountRepository from './AccountRepository';

export default class AccountRepositoryDatabase implements AccountRepository {
  constructor(
    private _connection: any
  ) {}

  async save(account: Account): Promise<Account> {
    await this._connection.query(
      'INSERT INTO account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        account.getId(), 
        account.getName(), 
        account.getEmail(), 
        account.getCpf(), 
        account.getCarPlate(), 
        !!account.isPassenger, 
        !!account.isDriver
      ]
    );
    const newAccount = Account.restoreAccount(
      account.getId(),
      account.getName(),
      account.getEmail(),
      account.getPassword(),
      account.getCpf(),
      account.isDriver,
      account.isPassenger,
      account.getCarPlate(),
    );
    return newAccount;
  }

  async getByEmail(email: string): Promise<Account | undefined> {
    const [accountData] = await this._connection.query('SELECT * FROM account WHERE email = $1', [email]);
    if (!accountData) return;
    return Account.restoreAccount(
      accountData.account_id,
      accountData.name,
      accountData.email,
      'password',
      accountData.cpf,
      accountData.is_driver,
      accountData.is_passenger,
      accountData.car_plate
    );
  }

  async getById(accountId: string): Promise<Account | undefined> {
    const [accountData] = await this._connection.query('SELECT * FROM account WHERE account_id = $1', [accountId]);
    if (!accountData) return;
    return Account.restoreAccount(
      accountData.account_id,
      accountData.name,
      accountData.email,
      'password',
      accountData.cpf,
      accountData.is_driver,
      accountData.is_passenger,
      accountData.car_plate
    );
  }
}

type AccountData = {
  id: string;
  name: string;
  email: string;
  password: string;
  cpf: string;
  isDriver: boolean;
  isPassenger: boolean;
  carPlate: string | null;
};