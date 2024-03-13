import Signup from './app/usecase/Signup';
import GetAccount from './app/usecase/GetAccount';
import PgPromiseAdapter from './infra/database/PgPromiseAdapter';
import AccountRepositoryDatabase from './infra/repository/AccountRepositoryDatabase';
import Registry from './infra/di/Registry';
import httpController from './infra/http/httpController';
import ExpressAdapter from './infra/http/ExpressAdapter';

async function run() {
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
  const port = 3000;
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

run();