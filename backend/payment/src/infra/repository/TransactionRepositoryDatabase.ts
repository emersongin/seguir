import Transaction from '../../domain/Trasaction';
import SQLDataBaseGateway from '../gateway/SQLDataBaseGateway';
import TransactionRepository from './TransactionRepository';

export default class TransactionRepositoryDatabase implements TransactionRepository {
  constructor(private readonly database: SQLDataBaseGateway) {}

  async getTransactionByRideId(rideId: string): Promise<Transaction | undefined> {
    const [transaction] = await this.database.query('SELECT * FROM transaction WHERE ride_id = $1', [rideId]);
    if (!transaction) return;
    return transaction;
  }

  async save(transaction: Transaction): Promise<Transaction> {
    await this.database.query('INSERT INTO transaction (transaction_id, ride_id, amount, date, status) VALUES ($1, $2, $3, $4, $5)', 
      [
        transaction.id, 
        transaction.rideId,
        transaction.amount,
        transaction.getDate(),
        transaction.getStatus()
      ]
    );
    return transaction;
  }
}