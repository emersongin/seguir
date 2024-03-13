import QueueController from './infra/queue/QueueController';
import RabbitMqAdapter from './infra/queue/RabbitMqAdapter';

async function run() {
  const queue = new RabbitMqAdapter();
  await queue.connect();
  const queueController = new QueueController(queue);
}

run();