import Queue from './Queue';
import Signup, { SignupInputDto } from '../../app/usecase/Signup';

export default class QueueController {
  constructor(
    readonly queue: Queue,
    readonly signup: Signup,
  ) {
    queue.consume('signup', async (message: any) => {
      const input = message as SignupInputDto;
      await signup.execute(input);
    });
  }
}