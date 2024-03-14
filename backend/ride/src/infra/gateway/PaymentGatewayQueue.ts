import PaymentGateway from './PaymentGateway';
import AccountGateway, { ProcessPaymentInputDto } from './PaymentGateway';
import Queue from '../queue/Queue';

export default class PaymentGatewayQueue implements PaymentGateway {
  readonly queueName = 'processPayment';

  constructor (
    readonly queue: Queue
  ) {}

  async processPayment(input: ProcessPaymentInputDto): Promise<boolean> {
    return await this.queue.publish(this.queueName, input);
  }
}