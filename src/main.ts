import ExpressAdapter from './infra/http/ExpressAdapter';
import MainController from './infra/controller/mainController';
import Signup from './app/usecase/Signup';
import GetAccount from './app/usecase/GetAccount';
import SQLDataBaseGatewayPGP from './infra/gateway/SQLDataBaseGatewayPGP';
import AccountRepositoryPGP from './infra/repository/AccountRepositoryPGP';

const server = new ExpressAdapter();
const pgpDatabase = new SQLDataBaseGatewayPGP();
pgpDatabase.connect();
const accountRepository = new AccountRepositoryPGP(pgpDatabase);
const singup = new Signup(accountRepository);
const getAccount = new GetAccount(accountRepository);
const controller = new MainController(server, singup, getAccount);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
