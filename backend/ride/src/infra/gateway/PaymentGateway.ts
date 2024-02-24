export default interface PaymentGateway {
  processPayment(input: ProcessPaymentInputDto): Promise<void>;
  getRideTransaction(rideId: string): Promise<GetRideTransactionOutputDto | undefined>;
}

export type ProcessPaymentInputDto = {
  rideId: string;
  creditCardToken: string;
  amount: number;
};

export type GetRideTransactionOutputDto = {
  id: string;
  status: string;
}