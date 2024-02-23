export default interface PaymentGateway {
  process(input: InputDto): Promise<boolean>;
}

export type PaymentInputDto = {
  creditCardToken: string;
  amount: number;
};
