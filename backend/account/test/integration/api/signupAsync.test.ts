import crypto from 'crypto';
import Queue from '../../../src/infra/queue/Queue';
import RabbitMqAdapter from '../../../src/infra/queue/RabbitMqAdapter';

describe('teste para enfileramento de nova de conta', () => {
  let queue: Queue;

  beforeAll(async () => {
    queue = new RabbitMqAdapter();
    await queue.connect();
  });

  afterAll(async () => {
    setTimeout(async () => {
      await queue.close();
    }, 1000);
  });

  it('deve enfilerar uma nova de conta', async () => {
    const uuid = crypto.randomUUID();
    const input = {
      name: 'Emerson Andrey',
      email: `test_${uuid}@hotmail.com`,
      password: 'senha_valida',
      cpf: '649.731.080-06',
      isDriver: false,
      isPassenger: true,
      carPlate: null,
      creditCardToken: '123456789'
    };
    const output = await queue.publish('signup', input);
    expect(output).toBe(true);
  });
});