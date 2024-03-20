import DatabaseConnection from '../../infra/database/DatabaseConnection';

export default class GetAccountQuery {
  constructor(
    readonly connection: DatabaseConnection
  ) {}

  async execute(accountId: string): Promise<OutputDto> {
    const [account] = await this.connection.query(
      `SELECT 
        a.account_id as id, 
        a.name, 
        a.email, 
        a.cpf, 
        a.is_driver, 
        a.is_passenger, 
        a.car_plate, 
        a.credit_card_token
      FROM 
        account a 
      WHERE 
        a.account_id = ?`, [accountId]);
    if (!account) throw new Error('Account not found.');
    return {
      accountId: account.id,
      accountName: account.name,
      accountEmail: account.email,
      accountCpf: account.cpf,
      accountIsDriver: account.is_driver,
      accountIsPassenger: account.is_passenger,
      accountCarPlate: account.car_plate,
      accountCreditCardToken: account.credit_card_token
    };
  }
}

type OutputDto = {
  accountId: string;
  accountName: string;
  accountEmail: string;
  accountCpf: string;
  accountIsDriver: boolean;
  accountIsPassenger: boolean;
  accountCarPlate: string | null;
  accountCreditCardToken: string | null;
};