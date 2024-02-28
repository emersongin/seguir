import ExpressAdapter from './infra/http/ExpressAdapter';
import PgPromiseAdapter from './infra/database/PgPromiseAdapter';
import RideRepositoryDatabase from './infra/repository/RideRepositoryDatabase';
import GetRide from './app/usecase/GetRide';
import RequestRide from './app/usecase/RequestRide';
import AccountGatewayHttp from './infra/gateway/AccountGatewayHttp';
import httpController from './infra/http/httpController';
import Registry from './infra/di/Registry';

const pgpDatabase = new PgPromiseAdapter();
pgpDatabase.connect();
const accountGateway = new AccountGatewayHttp();
const rideRepository = new RideRepositoryDatabase(pgpDatabase);
const requestRide = new RequestRide(rideRepository, accountGateway);
const getRide = new GetRide(rideRepository);
const registry = Registry.getInstance();
registry.register('requestRide', requestRide);
registry.register('getRide', getRide);
const server = new ExpressAdapter();
const controller = new httpController(server);
const port = 3001;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});