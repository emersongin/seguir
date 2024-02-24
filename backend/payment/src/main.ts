import ExpressAdapter from './infra/http/ExpressAdapter';
import MainController from './infra/controller/mainController';
import SQLDataBaseGatewayPGP from './infra/gateway/SQLDataBaseGatewayPGP';
import ProcessPayment from './app/usecase/ProcessPayment';
import PaymentGatewayRede from './infra/gateway/PaymentGatewayRede';
import TransactionRepositoryDatabase from './infra/repository/TransactionRepositoryDatabase';
import GetRideTransaction from './app/usecase/GetRideTransaction';

const server = new ExpressAdapter();
const pgpDatabase = new SQLDataBaseGatewayPGP();
pgpDatabase.connect();
const paymentGatewayRede = new PaymentGatewayRede();
const transactionRepository = new TransactionRepositoryDatabase(pgpDatabase);
const processPayment = new ProcessPayment(paymentGatewayRede, transactionRepository);
const getRideTransaction = new GetRideTransaction(transactionRepository);
const controller = new MainController(server, processPayment, getRideTransaction);

const port = 3002;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
