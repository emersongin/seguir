import ExpressAdapter from './infra/http/ExpressAdapter';
import MainController from './infra/controller/mainController';
import SQLDataBaseGatewayPGP from './infra/gateway/SQLDataBaseGatewayPGP';
import ProcessPayment from './app/usecase/ProcessPayment';
import PaymentGatewayRede from './infra/gateway/PaymentGatewayRede';
import TransactionRepositoryDatabase from './infra/repository/TransactionRepositoryDatabase';
import GetTransactionByRide from './app/usecase/GetTransactionByRide';

const server = new ExpressAdapter();
const pgpDatabase = new SQLDataBaseGatewayPGP();
pgpDatabase.connect();
const paymentGatewayRede = new PaymentGatewayRede();
const transactionRepository = new TransactionRepositoryDatabase(pgpDatabase);
const processPayment = new ProcessPayment(paymentGatewayRede, transactionRepository);
const getTransactionByRide = new GetTransactionByRide(transactionRepository);
const controller = new MainController(server, processPayment, getTransactionByRide);

const port = 3002;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
