import PaymentGateway from '../../infra/gateway/PaymentGateway';

export default class ProcessPayment {
  constructor(private readonly paymentGateway: PaymentGateway) {}

  async execute(input: InputDto): Promise<void> {
    const { rideId, creditCardToken, amount } = input;
    const paymentResult = await this.paymentGateway.process({ creditCardToken, amount});
    if (paymentResult !== 'success') throw new Error("Payment failed!");
  }
}

type InputDto = {
  rideId: string;
  creditCardToken: string;
  amount: number;
};