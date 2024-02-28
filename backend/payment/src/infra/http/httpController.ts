import HttpServer from '../http/HttpServer';
import ProcessPayment from '../../app/usecase/ProcessPayment';
import GetRideTransaction from '../../app/usecase/GetRideTransaction';
import Registry from '../di/Registry';

export default class httpController {
	registry: Registry = Registry.getInstance();

	constructor (
    readonly httpServer: HttpServer
  ) {
		httpServer.post('/process_payment', async (params: any, body: any) => {
			const output = await this.registry.inject('processPayment').execute(body);
			return output;
		});

		httpServer.get('/transaction/:rideId', async (params: any, body: any) => {
			const output = await this.registry.inject('getRideTransaction').execute(params.rideId);
			return output;
		});
	}
}