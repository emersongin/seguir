import QueueController from './infra/queue/QueueController';
import RabbitMqAdapter from './infra/queue/RabbitMqAdapter';
import Registry from './infra/di/Registry';
import Signup from './app/usecase/Signup';
import PgPromiseAdapter from './infra/database/PgPromiseAdapter';
import AccountRepositoryDatabase from './infra/repository/AccountRepositoryDatabase';

async function run() {
  const queue = new RabbitMqAdapter();
  await queue.connect();
  const pgpDatabase = new PgPromiseAdapter();
  await pgpDatabase.connect();
  const accountRepository = new AccountRepositoryDatabase(pgpDatabase);
  const singup = new Signup(accountRepository);
  const queueController = new QueueController(queue, singup);
}

run();