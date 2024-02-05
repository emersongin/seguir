import ExpressAdapter from './infra/http/ExpressAdapter';
import MainController from './infra/controller/mainController';
import Signup from './app/usecase/Signup';
import MemoryAccountRepository from './infra/repository/MemoryAccountRepository';
import GetAccount from './app/usecase/GetAccount';

const server = new ExpressAdapter();

const accountRepository = new MemoryAccountRepository();
const singup = new Signup(accountRepository);
const getAccount = new GetAccount(accountRepository);
const controller = new MainController(server, singup, getAccount);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
