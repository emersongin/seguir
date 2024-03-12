import Signup from './app/usecase/Signup';
import GetAccount from './app/usecase/GetAccount';
import PgPromiseAdapter from './infra/database/PgPromiseAdapter';
import AccountRepositoryDatabase from './infra/repository/AccountRepositoryDatabase';
import Registry from './infra/di/Registry';
import httpController from './infra/http/httpController';
import QueueController from './infra/queue/QueueController';
import ExpressAdapter from './infra/http/ExpressAdapter';
import RabbitMqAdapter from './infra/queue/RabbitMqAdapter';

async function run() {
  const queue = new RabbitMqAdapter();
  await queue.connect();
  const pgpDatabase = new PgPromiseAdapter();
  await pgpDatabase.connect();
  const accountRepository = new AccountRepositoryDatabase(pgpDatabase);
  const singup = new Signup(accountRepository);
  const getAccount = new GetAccount(accountRepository);
  const registry = Registry.getInstance();
  registry.register('signup', singup);
  registry.register('getAccount', getAccount);
  const server = new ExpressAdapter();
  const controller = new httpController(server);
  const queueController = new QueueController(queue);
  const port = 3000;
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

run();