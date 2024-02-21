import ExpressAdapter from './infra/http/ExpressAdapter';
import MainController from './infra/controller/mainController';
import SQLDataBaseGatewayPGP from './infra/gateway/SQLDataBaseGatewayPGP';
import RideRepositoryDatabase from './infra/repository/RideRepositoryDatabase';
import GetRide from './app/usecase/GetRide';
import RequestRide from './app/usecase/RequestRide';
import AccountGatewayHttp from './infra/gateway/AccountGatewayHttp';

const server = new ExpressAdapter();
const pgpDatabase = new SQLDataBaseGatewayPGP();
pgpDatabase.connect();
const accountGateway = new AccountGatewayHttp();
const rideRepository = new RideRepositoryDatabase(pgpDatabase);
const requestRide = new RequestRide(rideRepository, accountGateway);
const getAccount = new GetRide(rideRepository);
const controller = new MainController(server, requestRide, getAccount);

const port = 3001;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});