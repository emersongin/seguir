export default interface PaymentGateway {
  process(input: PaymentInputDto): Promise<boolean>;
}

export type PaymentInputDto = {
  creditCardToken: string;
  amount: number;
};
