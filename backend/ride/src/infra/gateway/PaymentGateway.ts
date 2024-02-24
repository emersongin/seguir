export default interface PaymentGateway {
  processPayment(input: ProcessPaymentInputDto): Promise<void>;
  getTransactionByRideId(rideId: string): Promise<GetTransactionOutputDto | undefined>;
}

export type ProcessPaymentInputDto = {
  rideId: string;
  creditCardToken: string;
  amount: number;
};

export type GetTransactionOutputDto = {
  id: string;
  status: string;
}