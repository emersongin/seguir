import ExpressAdapter from './infra/http/ExpressAdapter';
import PgPromiseAdapter from './infra/database/PgPromiseAdapter';
import RideRepositoryDatabase from './infra/repository/RideRepositoryDatabase';
import GetRide from './app/usecase/GetRide';
import RequestRide from './app/usecase/RequestRide';
import AccountGatewayRest from './infra/gateway/AccountGatewayRest';
import httpController from './infra/http/httpController';
import Registry from './infra/di/Registry';
import AcceptRide from './app/usecase/AcceptRide';
import FinishRide from './app/usecase/FinishRide';
import StartRide from './app/usecase/StartRide';
import UpdatePosition from './app/usecase/UpdatePosition';
import PositionRepositoryDatabase from './infra/repository/PositionRepositoryDatabase';
import PaymentGatewayQueue from './infra/gateway/PaymentGatewayQueue';
import AxiosAdapter from './infra/http/AxiosAdapter';
import RabbitMqAdapter from './infra/queue/RabbitMqAdapter';

async function run() {
  const queue = new RabbitMqAdapter();
  const axios = new AxiosAdapter();
  const accountGateway = new AccountGatewayRest(axios);
  const paymentGateway = new PaymentGatewayQueue(queue);
  const pgpDatabase = new PgPromiseAdapter();
  pgpDatabase.connect();
  const rideRepository = new RideRepositoryDatabase(pgpDatabase);
  const positionRepository = new PositionRepositoryDatabase(pgpDatabase);
  const requestRide = new RequestRide(rideRepository, accountGateway);
  const acceptRide = new AcceptRide(rideRepository, accountGateway);
  const startRide = new StartRide(rideRepository);
  const finishRide = new FinishRide(rideRepository, positionRepository, accountGateway, paymentGateway);
  const updatePosition = new UpdatePosition(rideRepository, positionRepository);
  const getRide = new GetRide(rideRepository);
  const registry = Registry.getInstance();
  registry.register('requestRide', requestRide);
  registry.register('acceptRide', acceptRide);
  registry.register('startRide', startRide);
  registry.register('finishRide', finishRide);
  registry.register('updatePosition', updatePosition);
  registry.register('getRide', getRide);
  const server = new ExpressAdapter();
  const controller = new httpController(server);
  const port = 3001;
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

run();