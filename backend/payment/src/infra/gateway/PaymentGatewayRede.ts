import PaymentGateway, { PaymentInputDto } from './PaymentGateway';

export default class PaymentGatewayRede implements PaymentGateway {
  async process(input: PaymentInputDto): Promise<boolean> {
    return true;
  }
}