import TransactionRepository from '../../infra/repository/TransactionRepository';


export default class GetTransactionByRide {
  constructor(
    private readonly transactionRepository: TransactionRepository
  ) {}

  async execute(rideId: string): Promise<OutputDto>{
    const transaction = await this.transactionRepository.getTransactionByRideId(rideId);
    if (!transaction) throw new Error('Transaction not found');
    return {
      id: transaction.id,
      status: transaction.getStatus()
    }
  }
}

type OutputDto = {
  id: string;
  status: string;
}