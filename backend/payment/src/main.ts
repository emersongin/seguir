import ExpressAdapter from './infra/http/ExpressAdapter';
import PgPromiseAdapter from './infra/database/PgPromiseAdapter';
import ProcessPayment from './app/usecase/ProcessPayment';
import PaymentGatewayRede from './infra/gateway/PaymentGatewayRede';
import TransactionRepositoryDatabase from './infra/repository/TransactionRepositoryDatabase';
import GetRideTransaction from './app/usecase/GetRideTransaction';
import httpController from './infra/http/httpController';
import Registry from './infra/di/Registry';

const pgpDatabase = new PgPromiseAdapter();
pgpDatabase.connect();
const paymentGatewayRede = new PaymentGatewayRede();
const transactionRepository = new TransactionRepositoryDatabase(pgpDatabase);
const processPayment = new ProcessPayment(paymentGatewayRede, transactionRepository);
const getRideTransaction = new GetRideTransaction(transactionRepository);
const registry = Registry.getInstance();
registry.register('processPayment', processPayment);
registry.register('getRideTransaction', getRideTransaction);
const server = new ExpressAdapter();
const controller = new httpController(server);
const port = 3002;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
