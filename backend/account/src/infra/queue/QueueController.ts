import Queue from './Queue';

export default class QueueController {
  constructor(
    readonly queueService: Queue
  ) {
    queueService.consume('signup', async (input: any) => {
      console.log(input);
    });
  }
}