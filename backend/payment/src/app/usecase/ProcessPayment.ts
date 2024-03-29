import PaymentGateway from '../../infra/gateway/PaymentGateway';
import TransactionRepository from '../../infra/repository/TransactionRepository';
import Transaction from '../../domain/Trasaction';

export default class ProcessPayment {
  constructor(
    private readonly paymentGateway: PaymentGateway,
    private readonly transactionRepository: TransactionRepository
  ) {}

  async execute(input: ProcessPaymentInputDto): Promise<void> {
    const { rideId, creditCardToken, amount } = input;
    const transaction = Transaction.create(rideId, amount);
    await this.paymentGateway.process({ creditCardToken, amount });
    transaction.paid();
    await this.transactionRepository.save(transaction);
  }
}

export type ProcessPaymentInputDto = {
  rideId: string;
  creditCardToken: string;
  amount: number;
};