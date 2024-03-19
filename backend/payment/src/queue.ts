import RabbitMqAdapter from './infra/queue/RabbitMqAdapter';
import PgPromiseAdapter from '../../account/src/infra/database/PgPromiseAdapter';
import QueueController from './infra/queue/QueueController';
import ProcessPayment from './app/usecase/ProcessPayment';
import PaymentGatewayRede from './infra/gateway/PaymentGatewayRede';
import TransactionRepositoryDatabase from './infra/repository/TransactionRepositoryDatabase';

async function run() {
  const queue = new RabbitMqAdapter();
  await queue.connect();
  const pgpDatabase = new PgPromiseAdapter();
  await pgpDatabase.connect();
  const transactionRepository = new TransactionRepositoryDatabase(pgpDatabase);
  const paymentGateway = new PaymentGatewayRede();
  const processPayment = new ProcessPayment(paymentGateway, transactionRepository);
  const queueController = new QueueController(queue, processPayment);
}

run();