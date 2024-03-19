import Queue from './Queue';
import ProcessPayment, { ProcessPaymentInputDto } from '../../app/usecase/ProcessPayment';

export default class QueueController {
  constructor(
    readonly queue: Queue,
    readonly processPayment: ProcessPayment,
  ) {
    queue.consume('processPayment', async (message: any) => {
      console.log(message);
      const input = message as ProcessPaymentInputDto;
      await processPayment.execute(input);
    });
  }
}