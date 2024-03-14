export default interface PaymentGateway {
  processPayment(input: ProcessPaymentInputDto): Promise<boolean>;
}

export type ProcessPaymentInputDto = {
  rideId: string;
  creditCardToken: string;
  amount: number;
};