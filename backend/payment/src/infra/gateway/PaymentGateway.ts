export default interface PaymentGateway {
  process(input: InputDto): Promise<string>;
}

export type PaymentInputDto = {
  creditCardToken: string;
  amount: number;
};
