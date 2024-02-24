import Transaction from '../../domain/Trasaction';

export default interface TransactionRepository {
  getRideTransaction(rideId: string): Promise<Transaction | undefined>;
  save(transaction: Transaction): Promise<Transaction>;
}