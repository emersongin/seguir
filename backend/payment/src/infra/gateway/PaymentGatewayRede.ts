import PaymentGateway, { PaymentInputDto } from './PaymentGateway';

export default class PaymentGatewayRede implements PaymentGateway {
  async process(input: PaymentInputDto): Promise<string> {
    // Call Rede API
    return 'success';
  }
}