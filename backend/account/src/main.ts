import ExpressAdapter from './infra/http/ExpressAdapter';
import MainController from './infra/controller/mainController';
import Signup from './app/usecase/Signup';
import GetAccount from './app/usecase/GetAccount';
import SQLDataBaseGatewayPGP from './infra/gateway/SQLDataBaseGatewayPGP';
import AccountRepositoryDatabase from './infra/repository/AccountRepositoryDatabase';

const server = new ExpressAdapter();
const pgpDatabase = new SQLDataBaseGatewayPGP();
pgpDatabase.connect();
const accountRepository = new AccountRepositoryDatabase(pgpDatabase);
const singup = new Signup(accountRepository);
const getAccount = new GetAccount(accountRepository);
const controller = new MainController(server, singup, getAccount);

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
